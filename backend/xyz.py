import sys
import os
import subprocess

print("=" * 50)
print("PYTHON ENVIRONMENT DEBUGGER")
print("=" * 50)

# 1. Show Python path and version
print("\n1. PYTHON INFORMATION:")
print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print(f"Prefix: {sys.prefix}")

# 2. Show sys.path
print("\n2. PYTHON PATH (where Python looks for modules):")
for i, path in enumerate(sys.path):
    print(f"  {i}: {path}")

# 3. Check virtual environment
print("\n3. VIRTUAL ENVIRONMENT:")
venv_path = os.environ.get('VIRTUAL_ENV', 'Not activated')
print(f"Virtual env: {venv_path}")

# 4. Check essential packages
print("\n4. PACKAGE AVAILABILITY:")
packages_to_check = ['flask', 'numpy', 'librosa', 'tensorflow', 'werkzeug']

for package in packages_to_check:
    try:
        __import__(package)
        version = getattr(__import__(package), '__version__', 'unknown')
        print(f"  ✓ {package} (v{version}) - IMPORT SUCCESS")
    except ImportError as e:
        print(f"  ✗ {package} - IMPORT FAILED: {e}")

# 5. Try to find packages using pkg_resources
print("\n5. PACKAGE RESOLVER CHECK:")
try:
    import pkg_resources
    for package in packages_to_check:
        try:
            dist = pkg_resources.get_distribution(package)
            print(f"  ✓ {package} (v{dist.version}) - FOUND BY PACKAGE RESOLVER")
        except pkg_resources.DistributionNotFound:
            print(f"  ✗ {package} - NOT FOUND BY PACKAGE RESOLVER")
except ImportError:
    print("  pkg_resources not available")

# 6. Check if we can install packages
print("\n6. PIP CHECK:")
try:
    # Try to run pip list
    result = subprocess.run([sys.executable, '-m', 'pip', 'list'], 
                          capture_output=True, text=True, timeout=10)
    print("Packages installed:")
    # Show only relevant packages
    lines = result.stdout.split('\n')
    for line in lines:
        if any(pkg in line.lower() for pkg in packages_to_check):
            print(f"  {line}")
except Exception as e:
    print(f"  Error checking pip: {e}")

print("\n" + "=" * 50)
print("Run this script using the same Python interpreter that gives the 'module not found' error")
print("=" * 50)