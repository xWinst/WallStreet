import { Icon } from 'components';
import { useState } from 'react';
import s from './NameEditForm.module.css';

const NameEditForm = ({ name, cancel, submit }) => {
    const [user, setUser] = useState(name);

    const saveData = event => {
        setUser(event.target.value);
    };

    const onSubmit = event => {
        event.preventDefault();
        submit(user);
    };

    return (
        <form className={s.form} onSubmit={onSubmit}>
            <input className={s.input} value={user} onChange={saveData} />
            <Icon cn={s.icon} icon="ok" w={20} onClick={() => submit(user)} />
            <Icon cn={s.icon} icon="cancel" w={20} onClick={cancel} />
        </form>
    );
};

export default NameEditForm;
