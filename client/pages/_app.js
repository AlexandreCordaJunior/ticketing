import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";

const AppComponent = ({ Component, pageProps }) => {
    return (
        <div>
            <Component {...pageProps} />
        </div>
    )
};

AppComponent.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get("/api/users/currentUser");
    return data;
};

export default AppComponent;