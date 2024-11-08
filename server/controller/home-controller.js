const home = async (req, res) => {
    try {
        res.status(200).send("Hello World From Router");
    } catch (error) {
        res.status(200).send("Server Crash");
    }
}

export default home;