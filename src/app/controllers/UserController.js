import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Preencha o campo nome.'),
      email: Yup.string()
        .email('Insira um e-mail válido.')
        .required('Preencha o campo e-mail.'),
      password: Yup.string()
        .required('Preencha o campo senha.')
        .min(6, 'A senha deve conter no mínimo 6 caracters.'),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'e-mail já cadastrado' });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email('Insira um e-mail válido.'),
      oldPassword: Yup.string().min(
        6,
        'A senha deve conter no mínimo 6 caracters.'
      ),
      password: Yup.string()
        .min(6, 'A nova senha deve conter no mínimo 6 caracters.')
        .when('oldPassword', (oldPassword, field) =>
          oldPassword
            ? field.required('Você deve inserir sua senha antiga.')
            : field
        ),
      confirmPassword: Yup.string().when('password', (password, fied) =>
        password
          ? fied
              .required('Confirme a nova senha.')
              .oneOf([Yup.ref('password')], 'Verifique a senha informada.')
          : fied
      ),
    });

    try {
      await schema.validate(req.body);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'e-mail já cadastrado' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'senha inválida' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
