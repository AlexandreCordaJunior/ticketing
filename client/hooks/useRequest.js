import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios({
                method,
                url,
                data: body
            });

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        }
        catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(erro => <li key={erro.message}>{erro.message}</li>)}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
};

export default useRequest;