# ****************************************************
# |docname| - Tests for `../CodeChat_Server/server.py`
# ****************************************************
#
# Imports
# =======
# These are listed in the order prescribed by `PEP 8`_.
#
# Standard library
# ----------------
from time import sleep
import socketserver
import subprocess
import sys

# Third-party imports
# -------------------
import pytest
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

# Local imports
# -------------
from CodeChat_Server.server import HTTP_PORT, THRIFT_PORT
from CodeChat_Server.gen_py.CodeChat_Services import EditorPlugin
from CodeChat_Server.gen_py.CodeChat_Services.ttypes import (
    RenderClientReturn,
    CodeChatClientLocation,
)


# Fixtures
# ========
SUBPROCESS_SERVER_ARGS = ([sys.executable, "-m", "CodeChat_Server"], )
SUBPROCESS_SERVER_KWARGS = dict(stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)


@pytest.fixture
def editor_plugin():
    p = subprocess.Popen(*SUBPROCESS_SERVER_ARGS, **SUBPROCESS_SERVER_KWARGS)
    # Wait for the server to start.
    out = ""
    line = ""
    #import pdb; pdb.set_trace()
    while "Ready.\n" not in line:
        p.stdout.flush()
        line = p.stdout.readline()
        out += line
        print(line, end="")
        if p.poll() is not None:
            # The server shut down.
            print(p.stdout.read())
            print(p.stderr.read())
            assert False
        sleep(0.1)

    transport = TSocket.TSocket('localhost', THRIFT_PORT)
    transport = TTransport.TBufferedTransport(transport)
    protocol = TBinaryProtocol.TBinaryProtocol(transport)
    client = EditorPlugin.Client(protocol)
    transport.open()

    # Provide the subprocess.
    client.subprocess = p
    yield client

    # If tests already shut down the server, skip telling it to shut down.
    if p.poll() is None:
        client.shutdown_server()
        p.wait()
    print(p.stdout.read())
    print(p.stderr.read())
    transport.close()


# Tests
# =====
def test_1():
    # Open a port, so that it's in use.
    with socketserver.TCPServer(
        ("localhost", HTTP_PORT), socketserver.BaseRequestHandler
    ):
        # Run the server.
        cp = subprocess.run(*SUBPROCESS_SERVER_ARGS, **SUBPROCESS_SERVER_KWARGS)
        # Check that it reported the ports were in use.
        assert "Error: ports " in cp.stdout


# Test the plugin with invalid IDs.
def test_2(editor_plugin):
    unknown_client = "Unknown client id 0."
    assert editor_plugin.start_render("", "", 0, False) == unknown_client
    assert editor_plugin.stop_client(0) == unknown_client


# Test the plugin shutdown.
def test_3(editor_plugin):
    assert editor_plugin.shutdown_server() == ""
    editor_plugin.subprocess.wait()
