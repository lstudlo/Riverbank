# Interaction Guidelines

## Commit Protocol
When the user says "commit":
0. If there are unstaged changes, prompt the user to stage them (Y/n).
1. Generate 3 concise commit message options:
    *   **Option 1 (Cleanest):** Ultra-minimalist and direct.
    *   **Option 2 (Normal):** Standard concise description.
    *   **Option 3 (Comprehensive):** Slightly more detailed but still concise, covering context if needed.
2. Present these options to the user.
3. Wait for the user to select one.
4. Execute the commit using the selected message.
