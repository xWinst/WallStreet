import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Main, Game, PageNotFound } from 'pages';
import { Loader } from 'components';
// import { game } from 'model';

const App = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="game" element={<Game />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    );
};

export default App;
