export default async (request, response) => {
    try {
        console.log("Hello")
        const fplData = fetch('https://create-react-app.now-examples.now.sh/api/date')
        console.log("DoneFetching")
        const json = await fplData.json()
        return response.send(json)
    } catch (err) {
        response.send(err)
    }
}