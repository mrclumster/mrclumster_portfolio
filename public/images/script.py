import os
from PIL import Image
from pillow_heif import register_heif_opener

# Register the HEIF opener
register_heif_opener()

def process_nested_images(input_root, output_root, max_width=1920, quality=80):
    # os.walk travels through all nested directories
    for current_dir, dirs, files in os.walk(input_root):
        
        # Calculate the relative path (e.g., 'day-1/intramuros') to maintain structure
        relative_path = os.path.relpath(current_dir, input_root)
        current_output_dir = os.path.join(output_root, relative_path)

        # Recreate the folder in the output directory if it doesn't exist
        if not os.path.exists(current_output_dir):
            os.makedirs(current_output_dir)

        for filename in files:
            input_path = os.path.join(current_dir, filename)
            file_lower = filename.lower()

            # 1. Process Images (HEIC, HEIF, JPG, JPEG, PNG)
            if file_lower.endswith(('.heic', '.heif', '.jpg', '.jpeg', '.png')):
                base_name = os.path.splitext(filename)[0]
                output_filename = f"{base_name}.webp"
                output_path = os.path.join(current_output_dir, output_filename)

                try:
                    with Image.open(input_path) as img:
                        width, height = img.size
                        if width > max_width:
                            ratio = max_width / width
                            new_height = int(height * ratio)
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                        
                        # Convert to RGB to avoid issues with transparency or color profiles
                        img.convert('RGB').save(output_path, "webp", quality=quality)
                        print(f"✅ Saved: {os.path.join(relative_path, output_filename)}")
                except Exception as e:
                    print(f"❌ Error with {filename}: {e}")

            # 2. Handle Videos (MOV, MP4)
            elif file_lower.endswith(('.mov', '.mp4')):
                # We skip these so you can handle them separately (e.g., YouTube/Vimeo embeds)
                print(f"⏩ Skipped video: {os.path.join(relative_path, filename)}")
            
            # Ignore hidden system files like .DS_Store or Thumbs.db
            else:
                pass

if __name__ == "__main__":
    # Point this to your main 'trip' folder
    INPUT_FOLDER = "./trip" 
    
    # The script will create this folder and build the day-1, day-2 structure inside it
    OUTPUT_FOLDER = "./optimized_trip"
    
    MAX_WIDTH = 1920 
    WEBP_QUALITY = 80 
    
    print("Starting recursive portfolio optimization...")
    process_nested_images(INPUT_FOLDER, OUTPUT_FOLDER, MAX_WIDTH, WEBP_QUALITY)
    print("\nDone! Your folder structure has been perfectly mirrored with optimized WebP files.")