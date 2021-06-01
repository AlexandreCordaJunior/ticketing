import buildClient from "../api/buildClient";

const landingPage = ({ currentUser }) => {
    return (
        currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
    );
};

landingPage.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get("/api/users/currentUser");
    return data;
};

export default landingPage;