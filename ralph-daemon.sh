#!/bin/bash
# Ralph Daemon - Runs independently from Claude session
# Usage: ./ralph-daemon.sh [max_iterations]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAX_ITERATIONS=${1:-8}

# Detach completely from current session
nohup "$SCRIPT_DIR/ralph-safe.sh" "$MAX_ITERATIONS" > "$SCRIPT_DIR/ralph-daemon.log" 2>&1 &

DAEMON_PID=$!

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  RALPH DAEMON STARTED                                          ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  PID: $DAEMON_PID                                                    ║"
echo "║  Max Iterations: $MAX_ITERATIONS                                              ║"
echo "║  Log: ralph-daemon.log                                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Ralph is now running independently in the background."
echo "It will continue even if your terminal or Claude session closes."
echo ""
echo "To monitor progress:"
echo "  tail -f $SCRIPT_DIR/ralph-daemon.log"
echo ""
echo "To check if it's still running:"
echo "  ps aux | grep ralph-safe.sh | grep -v grep"
echo ""
echo "To stop it:"
echo "  kill $DAEMON_PID"
echo ""
