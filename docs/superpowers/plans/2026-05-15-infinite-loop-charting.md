# Infinite Loop & Seaborn Charting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the single-shot auditor CLI into an interactive session with data visualization capabilities.

**Architecture:** Add a new Seaborn-based charting tool to the agent and refactor the entry point into a `while True` loop that handles user input and graceful exits.

**Tech Stack:** Python, Seaborn, Matplotlib, Pandas, DeepAgents.

---

### Task 1: Update Dependencies

**Files:**
- Modify: `pyproject.toml`

- [ ] **Step 1: Add seaborn and matplotlib to dependencies**

```toml
dependencies = [
    "deepagents>=0.6.1",
    "fastmcp>=2.14.1",
    "langchain-openrouter>=0.2.3",
    "loguru>=0.7.3",
    "pandas>=3.0.3",
    "pydantic>=2.12.0",
    "pytest>=9.0.0",
    "python-dotenv>=1.2.2",
    "seaborn>=0.13.2",
    "matplotlib>=3.10.0",
]
```

- [ ] **Step 2: Sync dependencies**

Run: `uv pip install seaborn matplotlib`
Expected: Successful installation of libraries.

- [ ] **Step 3: Commit**

```bash
git add pyproject.toml
git commit -m "chore: add seaborn and matplotlib dependencies"
```

---

### Task 2: Implement Charting Tool

**Files:**
- Modify: `audit_agent.py`

- [ ] **Step 1: Add imports for visualization**

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
```

- [ ] **Step 2: Implement `generate_invoice_chart` tool**

```python
def generate_invoice_chart() -> str:
    """Generate a bar chart showing the total invoice amount per vendor."""
    sql = """
        SELECT Vendors.Vendor_Name, SUM(Invoices.Amount) as Total_Amount
        FROM Invoices
        JOIN Vendors ON Invoices.Vendor_ID = Vendors.Vendor_ID
        GROUP BY Vendors.Vendor_Name
    """
    try:
        data = json.loads(query_ledger(sql))
        df = pd.DataFrame(data)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(x="Vendor_Name", y="Total_Amount", data=df)
        plt.xticks(rotation=45, ha='right')
        plt.title("Total Invoice Amount per Vendor")
        plt.tight_layout()
        
        output_path = "vendor_invoices.png"
        plt.savefig(output_path)
        plt.close()
        
        return f"Chart generated successfully and saved to {output_path}."
    except Exception as e:
        return f"Failed to generate chart: {str(e)}"
```

- [ ] **Step 3: Register tool and update system prompt**

Update `SYSTEM_PROMPT`:
```python
SYSTEM_PROMPT = """
You are the Senior Financial Auditor for Shree Manufacturing Pvt. Ltd.
You MUST use write_todos to outline a 3-step audit plan before taking any other action.
Use query_ledger for accounts payable data, check_delivery_log for warehouse receipts, and read_file for legal contracts.
Use generate_invoice_chart if the user asks for a graph, image, or visualization of vendor spending.
Calculate late-delivery penalties from the contract clause and report any discrepancy greater than INR 0.
""".strip()
```

Update `build_agent`:
```python
def build_agent(model_name: str):
    return create_deep_agent(
        model=model_name,
        tools=[query_ledger, check_delivery_log, read_file, generate_invoice_chart],
        system_prompt=SYSTEM_PROMPT,
    )
```

- [ ] **Step 4: Commit**

```bash
git add audit_agent.py
git commit -m "feat: add generate_invoice_chart tool"
```

---

### Task 3: Implement Interactive Loop

**Files:**
- Modify: `audit_agent.py`

- [ ] **Step 1: Refactor `main` function for infinite loop**

```python
def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", nargs="?", default=None)
    parser.add_argument("--self-check", action="store_true")
    args = parser.parse_args(argv)

    if args.self_check:
        print(run_self_check())
        return 0

    if args.prompt:
        print(invoke_agent(args.prompt))
        return 0

    print("--- Financial Auditor Session Started ---")
    print("Type your request or press Ctrl+C to exit.")
    
    try:
        while True:
            try:
                user_input = input("\nAuditor > ").strip()
                if not user_input:
                    continue
                
                response = invoke_agent(user_input)
                print(f"\nResponse: {response}")
                
            except EOFError:
                break
    except KeyboardInterrupt:
        print("\nExiting auditor session...")
    
    return 0
```

- [ ] **Step 2: Commit**

```bash
git add audit_agent.py
git commit -m "feat: implement interactive infinite loop in main"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run the auditor and test charting**

Run: `python main.py`
Input: `Can you show me a bar chart of invoice amounts per vendor?`
Expected: Agent calls `generate_invoice_chart`, returns success message, and `vendor_invoices.png` exists.

- [ ] **Step 2: Verify loop continues**

Input: `What is your job?`
Expected: Agent responds and prompts for another input.

- [ ] **Step 3: Verify Ctrl+C exit**

Action: Press `Ctrl+C`
Expected: Program prints "Exiting auditor session..." and terminates.
