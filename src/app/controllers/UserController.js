import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;
    // Validation user
    const schema = Yup.object().shape({
      name: Yup.string().required('Preencha o campo nome'),
      email: Yup.string()
        .email()
        .required('Preencha o campo e-mail'),
      password: Yup.string().required('Preencha o campo senha'),
    });

    if (schema) {
      const password_hash = password;

      const user = {
        name,
        email,
        password_hash,
      };
      const response = await User.create(user);
      return res.json(response);
    }

    return res.json({ ok: true });
  }

  async update(req, res) {
    return res.json({ user: 'update' });
  }
}

export default new UserController();
