#!/usr/bin/env python3
import sys
import os
import re

def parse_dot(dot_content):
    nodes = set()
    edges = {} # node -> list of children
    
    for line in dot_content.split('\n'):
        line = line.strip()
        if not line or line.startswith('digraph') or line.startswith('}'):
            continue
            
        match_def = re.match(r'^([a-zA-Z0-9_]+)\s*\[', line)
        if match_def:
            nodes.add(match_def.group(1))
            continue
            
        match_edge = re.match(r'^([a-zA-Z0-9_]+)\s*->\s*([a-zA-Z0-9_]+)', line)
        if match_edge:
            src = match_edge.group(1)
            dst = match_edge.group(2)
            nodes.add(src)
            nodes.add(dst)
            if src not in edges:
                edges[src] = []
            edges[src].append(dst)
            
    return sorted(list(nodes)), edges

def initialize_context(nodes, run_dir, run_id):
    os.makedirs(run_dir, exist_ok=True)
    context_file = os.path.join(run_dir, "context.md")
    
    lines = [
        f"# Attractor Run Context",
        f"",
        f"Run ID: {run_id}",
        f"",
        f"## Current State"
    ]
    
    for node in nodes:
        lines.append(f"- `{node}`: PENDING")
        
    lines.extend([
        f"",
        f"## Variables",
        f"- None"
    ])
    
    with open(context_file, "w") as f:
        f.write("\n".join(lines))
        
def update_context_state(run_dir, node, new_state):
    context_file = os.path.join(run_dir, "context.md")
    with open(context_file, "r") as f:
        content = f.read()
        
    # Replace the node state
    content = re.sub(rf"- `{node}`: [A-Z_]+", f"- `{node}`: {new_state}", content)
    
    with open(context_file, "w") as f:
        f.write(content)

def write_checkpoint(run_dir, node):
    checkpoint_file = os.path.join(run_dir, "checkpoint.md")
    with open(checkpoint_file, "w") as f:
        f.write(f"Checkpoint saved at node: {node}\n")

def run_pipeline(nodes, edges, run_dir):
    # Very simple traversal starting from 'start'
    queue = ['start'] if 'start' in nodes else (nodes[:1] if nodes else [])
    visited = set()
    
    while queue:
        current = queue.pop(0)
        if current in visited:
            continue
            
        visited.add(current)
        
        # Enter node
        update_context_state(run_dir, current, "IN_PROGRESS")
        
        # Execute node (simulated here)
        # ... execution logic ...
        
        # Exit node
        update_context_state(run_dir, current, "SUCCESS")
        write_checkpoint(run_dir, current)
        
        # Enqueue children
        if current in edges:
            for child in edges[current]:
                if child not in visited:
                    queue.append(child)

def main():
    if len(sys.argv) < 2:
        print("Usage: attractor_runner.py <pipeline.dot>")
        sys.exit(1)
        
    dot_file = sys.argv[1]
    base_dir = sys.argv[2] if len(sys.argv) > 2 else "attractor"
    run_id = "run_new"
    run_dir = os.path.join(os.getcwd(), base_dir, "runs", run_id)
    
    with open(dot_file, "r") as f:
        content = f.read()
        
    print(f"Loaded pipeline {dot_file}")
    
    nodes, edges = parse_dot(content)
    initialize_context(nodes, run_dir, run_id)
    
    # Run the pipeline traversal
    run_pipeline(nodes, edges, run_dir)

if __name__ == "__main__":
    main()
