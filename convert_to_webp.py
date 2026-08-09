import os
from PIL import Image

image_files = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "207.png",
    "306.png",
    "Department.jpg",
    "Golden.jpeg",
    "Hotelpashupati.jpg",
    "Logo.png",
    "logo_web.png",
    "Owner.jpg",
    "Reception.jpg",
    "Surendra Bhattarai.png",
    "Toilet.png",
    "aarohi.png",
    "family.png",
    "hotel out look 1.jpg",
    "hotel out look.jpg",
    "nepali.jpg",
    "temple.png",
]

workspace_dir = os.path.dirname(os.path.abspath(__file__))
total_orig_size = 0
total_webp_size = 0

print("Starting WebP Conversion...\n" + "="*50)

for filename in image_files:
    filepath = os.path.join(workspace_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping (not found): {filename}")
        continue
    
    orig_size = os.path.getsize(filepath)
    total_orig_size += orig_size
    
    # Target WebP filename
    base_name = os.path.splitext(filename)[0]
    webp_filename = base_name + ".webp"
    webp_path = os.path.join(workspace_dir, webp_filename)
    
    with Image.open(filepath) as img:
        # Convert RGBA/P to RGB if saving without alpha transparency or keep RGBA for WebP
        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
            # WebP supports alpha natively
            converted = img.convert("RGBA")
        else:
            converted = img.convert("RGB")
        
        # Resize oversized images (max 2048px on longest side for web)
        max_dim = 2048
        w, h = converted.size
        if w > max_dim or h > max_dim:
            if w >= h:
                new_w = max_dim
                new_h = int(h * (max_dim / w))
            else:
                new_h = max_dim
                new_w = int(w * (max_dim / h))
            converted = converted.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Save as WebP
        converted.save(webp_path, "WEBP", quality=82, method=6)
        
    webp_size = os.path.getsize(webp_path)
    total_webp_size += webp_size
    
    savings = (1 - (webp_size / orig_size)) * 100
    print(f"{filename:25s}: {orig_size/1024/1024:6.2f} MB -> {webp_filename:25s}: {webp_size/1024:6.1f} KB ({savings:5.1f}% saved)")

print("="*50)
print(f"TOTAL ORIGINAL SIZE : {total_orig_size / 1024 / 1024:.2f} MB")
print(f"TOTAL WEBP SIZE     : {total_webp_size / 1024 / 1024:.2f} MB")
overall_savings = (1 - (total_webp_size / total_orig_size)) * 100
print(f"OVERALL SAVINGS     : {overall_savings:.1f}%")
