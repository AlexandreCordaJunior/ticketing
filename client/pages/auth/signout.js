import { useEffect } from "react";
import useRequest from "../../hooks/useRequest";
import Router from "next/router";

export default function signout() {
    const { doRequest } = useRequest({
        url: "/api/users/signout",
        method: "post",
        body: {},
        onSuccess: () => {
            Router.push("/");
        }
    });

    useEffect(() => {
        doRequest();
    }, []);

    return (
        <div>
            Signing you out...
        </div>
    )
}
