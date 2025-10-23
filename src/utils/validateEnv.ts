import Joi from 'joi';

// Define the environment variable schema
const envSchema = Joi.object({
  NEXT_PUBLIC_APP_URL: Joi.string().uri().required(),
  NEXT_PUBLIC_SUPABASE_URL: Joi.string().required(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: Joi.string().required(),
  // TODO: this may not be needed, double check
  NEXT_PUBLIC_SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET:
    Joi.string().required(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: Joi.string().required(),
})
  .unknown() // This allows Joi to accept other environment variables if they exist
  .required();

export function validateEnv() {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: true, // Don't stop at the first error
    allowUnknown: false, // Allow unknown keys
  });

  if (error) {
    console.error('Environment variable validation errors:', error.details);
    process.exit(1); // Exit the app if validation fails
  }

  console.log('Environment variables validated successfully!');
}
