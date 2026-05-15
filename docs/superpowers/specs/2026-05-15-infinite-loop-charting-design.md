# Design Spec: Infinite Loop & Seaborn Charting

## 1. Overview
Transform the `audit_agent.py` from a single-shot command into an interactive auditor session. Add a visualization tool that allows the agent to generate bar charts of invoice amounts by vendor using Seaborn.

## 2. Requirements
- **Interactive Loop**: Run indefinitely until the user presses Ctrl+C.
- **Visualization**: Generate a static bar chart (PNG) of "Invoice Amount per Vendor".
- **Library**: Use `seaborn` and `matplotlib`.
- **Integration**: The agent must trigger the chart generation via a tool.

## 3. Architecture & Components

### 3.1 CLI Loop (`main` function)
- Replace the current `parser.parse_args()` logic for `prompt`.
- Implement a `while True:` loop.
- Use `input("Auditor > ")` for user prompts.
- Wrap the loop in a `try...except KeyboardInterrupt` block for clean exit.

### 3.2 Visualization Tool (`generate_invoice_chart`)
- **Query**: `SELECT Vendors.Vendor_Name, SUM(Invoices.Amount) as Total_Amount FROM Invoices JOIN Vendors ON Invoices.Vendor_ID = Vendors.Vendor_ID GROUP BY Vendors.Vendor_Name`
- **Logic**:
    - Load data into a Pandas DataFrame.
    - Create a Seaborn barplot (x='Vendor_Name', y='Total_Amount').
    - Rotate x-axis labels for readability if many vendors exist.
    - Save to `vendor_invoices.png` in the project root.
- **Return**: A string confirming the file has been saved (e.g., "Chart saved to vendor_invoices.png").

### 3.3 Agent Configuration
- Update `SYSTEM_PROMPT` to mention the charting capability.
- Add `generate_invoice_chart` to the `tools` list in `build_agent`.

## 4. Dependencies
Add the following to `pyproject.toml`:
- `seaborn>=0.13.2`
- `matplotlib>=3.10.0`

## 5. Testing Strategy
- **Manual Verification**: Run the interactive loop and ask "Can you show me a bar chart of invoice amounts per vendor?". Verify `vendor_invoices.png` is created and looks correct.
- **Loop Exit**: Verify Ctrl+C exits the program gracefully.
