# Fix Cloudinary Configuration

## ❌ Error Found

```
Invalid cloud_name SkinVox
```

The current Cloudinary cloud_name in Render.com is set to "SkinVox" which is not a valid Cloudinary cloud name.

## ✅ Solution

### Step 1: Get Your Cloudinary Cloud Name

1. Go to https://cloudinary.com/console
2. Log in to your Cloudinary account
3. Look at the top of the dashboard
4. You'll see something like:
   ```
   Welcome to cloud `df7k1c5ep`
   ```
   or
   ```
   Cloud: df7k1c5ep
   ```

This is your actual Cloudinary cloud name (usually starts with a lowercase letter and contains numbers/letters).

### Step 2: Update Environment Variables in Render.com

1. Go to https://dashboard.render.com
2. Select your backend service (skinvox-backend)
3. Click on "Environment" tab
4. Find and edit these variables:

   **CLOUDINARY_CLOUD_NAME**
   - Change from: `SkinVox`
   - Change to: Your actual Cloudinary cloud name (e.g., `df7k1c5ep`)

   **CLOUDINARY_API_KEY**
   - Make sure this is set to your actual API Key from Cloudinary

   **CLOUDINARY_API_SECRET**
   - Make sure this is set to your actual API Secret from Cloudinary

### Step 3: Get Cloudinary Credentials

If you don't have the correct credentials:

1. Go to https://cloudinary.com/console
2. Click on "Settings" icon (gear icon at top right)
3. Click on "Access keys" tab
4. You'll see:
   - **Cloud name**: `df7k1c5ep` (example - use YOUR actual one)
   - **API Key**: `123456789012345` (example)
   - **API Secret**: `AbC123dEf456GhI789` (example - click "Show" to reveal)

Copy these values exactly as they appear.

### Step 4: Update Render.com Environment

Go back to Render.com environment settings:

1. Set `CLOUDINARY_CLOUD_NAME` = Your actual cloud name (e.g., `df7k1c5ep`)
2. Set `CLOUDINARY_API_KEY` = Your API Key
3. Set `CLOUDINARY_API_SECRET` = Your API Secret
4. Make sure `STORAGE_TYPE=cloudinary`

5. Click "Save Changes"

### Step 5: Redeploy

After saving, Render.com will automatically redeploy your service.

### Step 6: Test Upload

Try uploading an image again from the Admin Dashboard.

## 📝 Example

**Wrong Configuration:**
```env
CLOUDINARY_CLOUD_NAME=SkinVox          ❌ Wrong!
CLOUDINARY_API_KEY=1234567890          ❌ Wrong!
CLOUDINARY_API_SECRET=secret123        ❌ Wrong!
```

**Correct Configuration:**
```env
CLOUDINARY_CLOUD_NAME=df7k1c5ep        ✅ Your actual cloud name
CLOUDINARY_API_KEY=987654321098765     ✅ Your actual API key
CLOUDINARY_API_SECRET=AbC123XyZ789     ✅ Your actual API secret
```

## 🔍 Verify Configuration

After updating, check the Render.com logs. You should see:

```
📝 Cloudinary Debug - Cloudinary config: {cloud_name: "set", api_key: "set", api_secret: "set"}
✅ Cloudinary Debug - Upload successful: https://res.cloudinary.com/...
```

Instead of:
```
❌ Invalid cloud_name SkinVox
```
