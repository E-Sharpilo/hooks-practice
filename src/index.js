import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

const App = () => {

    const [value, setValue] = useState(1);
    const [visible, setVisible] = useState(true)

    if (visible) {
        return (
            <div>
                <button onClick={() => setValue((v) => v + 1)}>+</button>
                <button onClick={() => setVisible(false)}>hide</button>
                <PlanetInfo id={value} />
            </div>
        )
    } else {
        return (
            <button onClick={() => setVisible(true)}>show</button>
        )
    }

};

const getPlanet = (id) => {
    return fetch(`https://swapi.dev/api/planets/${id}/`)
        .then(res => res.json())
        .then(data => data)

}



const useRequest = (request) => {
    const initialState = useMemo(() => ({
        data: null,
        loading: true,
        error: null
    }), [])


    const [dataState, setDataState] = useState(initialState);

    useEffect(() => {
        setDataState(initialState)
        let canceled = false;
        request().then(data => !canceled && setDataState({
            data,
            loading: false,
            error: null
        }))
            .catch(error => !canceled && setDataState({
                data: null,
                loading: false,
                error
            }))
        return () => canceled = true;
    }, [request, initialState])
    return dataState
}

const usePlanetName = (id) => {
    const request = useCallback(() => getPlanet(id), [id])
    return useRequest(request)
}

const PlanetInfo = ({ id }) => {

    const { data, loading, error } = usePlanetName(id)

    if (error) {
        return <div>Error</div>
    }
    if (loading) {
        return <div>Loading</div>
    }
    return (
        <div>{id} - {data.name}</div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))