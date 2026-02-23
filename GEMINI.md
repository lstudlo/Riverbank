# Interaction Guidelines

## Commit Protocol
When the user says "commit":
0. If there are unstaged changes, prompt the user to add them (Y/n, NOT COMMIT!).
1. Generate 3 concise commit message options, starting feat, refactor, chore, or fix:
    *   **Option 1 (Normal):** Standard concise commit message, include basic things done, but no.
    *   **Option 2 (Comprehensive):** Slightly more detailed but still concise, covering context if needed.
2. Present these options to the user.
3. Wait for the user to select one.
4. Execute the commit using the selected message.