class SessionController {
  async store(req, res) {
    return res.json({ store: 'session' });
  }
}

export default new SessionController();
