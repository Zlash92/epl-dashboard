export default async (req, res) => {
    try {
        return res.send("hello world")
    } catch (err) {
        res.send(err)
    }
}