import { getMicrosoftAuthUrl } from '../../../lib/microsoft';

export default function handler(req, res) {
  res.redirect(getMicrosoftAuthUrl());
}
