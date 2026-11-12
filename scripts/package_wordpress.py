#!/usr/bin/env python3
"""
SAHAND WordPress Package Generator
Packages sahand-theme and sahand-core into production-ready .zip archives
"""

import os
import zipfile

def package_directory(src_dir, zip_filename, root_folder_name):
    os.makedirs(os.path.dirname(zip_filename), exist_ok=True)
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(src_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, src_dir)
                archive_name = os.path.join(root_folder_name, rel_path)
                zf.write(full_path, archive_name)
    size_kb = os.path.getsize(zip_filename) / 1024
    print(f"Created {zip_filename} ({size_kb:.1f} KB) with root prefix '{root_folder_name}'")

def main():
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    theme_src = os.path.join(root, 'wordpress/wp-content/themes/sahand-theme')
    core_src = os.path.join(root, 'wordpress/wp-content/plugins/sahand-core')
    out_dir = os.path.join(root, 'public/downloads')

    theme_zip = os.path.join(out_dir, 'sahand-theme.zip')
    core_zip = os.path.join(out_dir, 'sahand-core.zip')

    if os.path.exists(theme_src):
        package_directory(theme_src, theme_zip, 'sahand-theme')
    else:
        print(f"Warning: Theme directory not found at {theme_src}")

    if os.path.exists(core_src):
        package_directory(core_src, core_zip, 'sahand-core')
    else:
        print(f"Warning: Core plugin directory not found at {core_src}")

if __name__ == '__main__':
    main()
