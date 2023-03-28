import { useSelector } from 'react-redux';
const Turn = () => {
    const turn = useSelector(state => state.turn);

    return <div>{turn.player}</div>;
};

export default Turn;
