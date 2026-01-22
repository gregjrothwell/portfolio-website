#!/bin/bash
# Safe Ralph Wrapper - Portfolio Website Enhancements
# Usage: ./ralph-safe.sh [max_iterations]

set -e

# ============================================================================
# SAFETY CONTROLS
# ============================================================================
MAX_ITERATIONS=${1:-8}           # Default: 8 iterations (one per user story)
MAX_BUDGET_USD=5.00              # $5 spending limit
TIMEOUT_PER_ITERATION=900        # 15 min per iteration (complex UI work)
MAX_CONSECUTIVE_FAILURES=3       # Abort after 3 failed iterations
ITERATION_DELAY=5                # 5 sec pause between iterations

# ============================================================================
# PATHS
# ============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_FILE="$SCRIPT_DIR/prd.json"
PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
LOG_DIR="$SCRIPT_DIR/ralph-logs"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# ============================================================================
# VALIDATION
# ============================================================================
if [ ! -f "$PRD_FILE" ]; then
    echo "ERROR: prd.json not found at $PRD_FILE"
    exit 1
fi

if ! command -v claude &> /dev/null; then
    echo "ERROR: claude CLI not found. Install it first."
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "ERROR: jq not found. Install it: brew install jq"
    exit 1
fi

# ============================================================================
# SETUP
# ============================================================================
mkdir -p "$LOG_DIR"

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
    cat > "$PROGRESS_FILE" <<EOF
# Ralph Progress Log - Portfolio Website Enhancements

**Started:** $(date)
**Branch:** ralph/portfolio-enhancements
**Total Stories:** 8
**Budget:** \$$MAX_BUDGET_USD

---

## Codebase Patterns

### Testing
- Run tests after every change: \`npm run test:run\`
- Tests must pass before committing
- Update tests if adding new JavaScript functionality

### Styling
- Use CSS custom properties (--primary-color, --bg-tertiary, etc.)
- Follow existing responsive breakpoints: 968px, 768px, 480px
- Match animation patterns (fade-in, intersection observer)

### HTML Structure
- Sections follow pattern: .section > .container > .section-header + content
- Maintain consistent spacing (6rem padding on sections)
- Use semantic HTML (section, article, nav, etc.)

---

EOF
fi

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  RALPH - SAFE MODE                                             ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Project: Portfolio Website Enhancements                       ║"
echo "║  Max Iterations: $MAX_ITERATIONS                                              ║"
echo "║  Budget Cap: \$$MAX_BUDGET_USD                                            ║"
echo "║  Timeout/Iteration: ${TIMEOUT_PER_ITERATION}s (15 min)                          ║"
echo "║  Max Failures: $MAX_CONSECUTIVE_FAILURES                                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# MAIN LOOP
# ============================================================================
FAILURE_COUNT=0
TOTAL_SPENT=0

for i in $(seq 1 $MAX_ITERATIONS); do
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  Ralph Iteration $i of $MAX_ITERATIONS"
    echo "═══════════════════════════════════════════════════════════════"

    ITERATION_LOG="$LOG_DIR/iteration-$i-$TIMESTAMP.log"

    # Run Claude with safety controls
    set +e  # Don't exit on command failure

    # Use perl for timeout (available on macOS)
    perl -e 'alarm shift; exec @ARGV' $TIMEOUT_PER_ITERATION \
        claude -p "$(cat "$SCRIPT_DIR/prompt.md")" \
        --dangerously-skip-permissions \
        --max-budget-usd $MAX_BUDGET_USD \
        --tools "Bash,Edit,Read,Write,Grep,Glob" \
        --output-format text \
        2>&1 | tee "$ITERATION_LOG"

    EXIT_CODE=$?
    set -e  # Re-enable exit on error

    # Check exit codes
    if [ $EXIT_CODE -eq 124 ]; then
        echo ""
        echo "⏱️  TIMEOUT: Iteration exceeded $TIMEOUT_PER_ITERATION seconds"
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
    elif [ $EXIT_CODE -ne 0 ]; then
        echo ""
        echo "❌ ERROR: Iteration failed with exit code $EXIT_CODE"
        FAILURE_COUNT=$((FAILURE_COUNT + 1))
    else
        echo ""
        echo "✅ Iteration $i completed successfully"
        FAILURE_COUNT=0  # Reset failure count on success
    fi

    # Check for completion signal
    if grep -q "<promise>COMPLETE</promise>" "$ITERATION_LOG" 2>/dev/null; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  ✅ RALPH COMPLETED ALL TASKS!                                ║"
        echo "╠════════════════════════════════════════════════════════════════╣"
        echo "║  Completed at iteration $i of $MAX_ITERATIONS                             ║"
        echo "║  Check progress.txt for details                                ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        exit 0
    fi

    # Check consecutive failures
    if [ $FAILURE_COUNT -ge $MAX_CONSECUTIVE_FAILURES ]; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════════╗"
        echo "║  ⚠️  TOO MANY CONSECUTIVE FAILURES                            ║"
        echo "╠════════════════════════════════════════════════════════════════╣"
        echo "║  Failed $FAILURE_COUNT times in a row. Aborting for safety.              ║"
        echo "║  Check logs in: $LOG_DIR                        ║"
        echo "╚════════════════════════════════════════════════════════════════╝"
        exit 1
    fi

    # Show progress
    echo ""
    echo "📊 Progress:"
    if command -v jq &> /dev/null && [ -f "$PRD_FILE" ]; then
        COMPLETED=$(jq '[.userStories[] | select(.passes == true)] | length' "$PRD_FILE")
        TOTAL=$(jq '.userStories | length' "$PRD_FILE")
        echo "   Stories completed: $COMPLETED / $TOTAL"
    fi

    # Pause between iterations
    if [ $i -lt $MAX_ITERATIONS ]; then
        echo ""
        echo "⏸️  Pausing ${ITERATION_DELAY}s before next iteration..."
        sleep $ITERATION_DELAY
    fi
done

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ⏹️  RALPH REACHED MAX ITERATIONS                             ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║  Completed $MAX_ITERATIONS iterations without finishing all tasks.       ║"
echo "║  Check progress.txt and prd.json for status                    ║"
echo "║  Logs saved to: $LOG_DIR                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Show incomplete stories
if command -v jq &> /dev/null && [ -f "$PRD_FILE" ]; then
    echo ""
    echo "Incomplete stories:"
    jq -r '.userStories[] | select(.passes == false) | "  - [\(.id)] \(.title)"' "$PRD_FILE"
fi

exit 1
