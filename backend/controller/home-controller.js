const home = async (req, res) => {
  try {
    res.status(200).json({ message: "Hello from Home Controller" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { home };
