import { Circle } from "better-react-spinkit"
import Head from "next/head"


const Loading = () => {
    return (
        <div>
            <Head>
                <title>Loading...</title>
            </Head>
            <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
                <div>
                    <img
                        src="/WhatsApp_logo_icon.png"
                        alt=""
                        style={{ marginBottom: 10 }}
                        height={200} />
                    <Circle color="#3CBC28" size={60} />
                </div>
            </center>
        </div>
    )
}


export default Loading