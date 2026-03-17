import os
import shutil
import tempfile
import pytest
import subprocess

def test_runner_initialization():
    assert os.path.exists("engine/scripts/attractor_runner.py")

def test_context_generation():
    test_dot = """
    digraph G {
        start [class="system"];
        node1 [class="codergen"];
        end [class="system"];
        start -> node1;
        node1 -> end;
    }
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        dot_path = os.path.join(temp_dir, "dummy.dot")
        with open(dot_path, "w") as f:
            f.write(test_dot)
            
        runner_path = os.path.abspath("engine/scripts/attractor_runner.py")
        subprocess.run(["python", runner_path, dot_path, "test_attractor"], check=False)
        
        context_file = os.path.join(os.getcwd(), "test_attractor", "runs", "run_new", "context.md")
        assert os.path.exists(context_file)
        
        with open(context_file, "r") as f:
            content = f.read()
            assert "- `start`: " in content
            assert "- `node1`: " in content
            assert "- `end`: " in content

        if os.path.exists(os.path.join(os.getcwd(), "test_attractor")):
            shutil.rmtree(os.path.join(os.getcwd(), "test_attractor"))

def test_node_traversal():
    test_dot = """
    digraph G {
        start [class="system"];
        node1 [class="codergen"];
        end [class="system"];
        start -> node1;
        node1 -> end;
    }
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        dot_path = os.path.join(temp_dir, "dummy_traversal.dot")
        with open(dot_path, "w") as f:
            f.write(test_dot)
            
        runner_path = os.path.abspath("engine/scripts/attractor_runner.py")
        # Pass a custom output dir if the runner supports it (let's update the runner)
        subprocess.run(["python", runner_path, dot_path, "test_attractor"], check=False)
        
        context_file = os.path.join(os.getcwd(), "test_attractor", "runs", "run_new", "context.md")
        assert os.path.exists(context_file)
        
        with open(context_file, "r") as f:
            content = f.read()
            # If traversal successfully ran to finish, all nodes should be SUCCESS
            assert "- `start`: SUCCESS" in content
            assert "- `node1`: SUCCESS" in content
            assert "- `end`: SUCCESS" in content

        checkpoint_file = os.path.join(os.getcwd(), "test_attractor", "runs", "run_new", "checkpoint.md")
        assert os.path.exists(checkpoint_file)

        if os.path.exists(os.path.join(os.getcwd(), "test_attractor")):
            shutil.rmtree(os.path.join(os.getcwd(), "test_attractor"))
