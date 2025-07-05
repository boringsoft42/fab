import { createClientComponentClient } from &ldquo;@supabase/auth-helpers-nextjs&rdquo;;

const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || &ldquo;avatars&rdquo;;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  &ldquo;image/jpeg&rdquo;,
  &ldquo;image/jpg&rdquo;,
  &ldquo;image/png&rdquo;,
  &ldquo;image/gif&rdquo;,
];

export async function uploadAvatar(file: File, userId: string) {
  // Validate file before upload
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      &ldquo;Invalid file type. Please upload a JPEG, PNG or GIF image.&rdquo;
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      &ldquo;File size too large. Please upload an image smaller than 2MB.&rdquo;
    );
  }

  try {
    const supabase = createClientComponentClient();

    // Upload the file to Supabase storage
    const fileExt = file.name.split(&ldquo;.&rdquo;).pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: &ldquo;3600&rdquo;,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error(&ldquo;Error uploading avatar:&rdquo;, error);
    throw error;
  }
}
