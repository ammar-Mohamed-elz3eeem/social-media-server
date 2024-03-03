import path from "path";

export default {
  uploads_path: path.join(__dirname, "..", "..", "uploads"),
  avatars_path: path.join(__dirname, "..", "..", "avatars"),
  allowed_types: ['image/png', 'image/jpg', 'image/jpeg']
}
