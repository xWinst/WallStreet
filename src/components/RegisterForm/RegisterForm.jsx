import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registration } from 'state/userOperations';
import { Button, Icon } from 'components';
import s from './RegisterForm.module.css';

const RegisterForm = () => {
    const [isOpenEye, setIsOpenEye] = useState(false);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ mode: 'onSubmit' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onHandleSubmit = data => {
        data.email = data.email.toLowerCase();

        dispatch(registration(data));
        reset();
        navigate('/login');
    };

    const showPassword = () => {
        setIsOpenEye(state => !state);
    };

    return (
        <div className={s.container}>
            <div className={s.goBack} onClick={() => navigate('/')}>
                <Icon icon="arrow-left" w={20} />
                <p className={s.text}>На главную</p>
            </div>
            <div className={s.box}>
                <form
                    className={s.form}
                    onSubmit={handleSubmit(onHandleSubmit)}
                >
                    <h2 className={s.title}>Создать аккаунт</h2>
                    <label>
                        <input
                            {...register('name', {
                                required: 'Это обязательное поле',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Минимальня длинна имени - 2 символа',
                                },
                                maxLength: 15,
                            })}
                            title="Никнейм в игре"
                            placeholder="Імя *"
                        />
                        <div className={s.error}>
                            {errors.name && (
                                <p className={s.errorText}>
                                    {errors.name.message || 'Некорректное имя'}
                                </p>
                            )}
                        </div>
                    </label>

                    <label>
                        <input
                            {...register('email', {
                                required: 'Это обязательное поле',
                                pattern: {
                                    value: /^([A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*\.[A-Za-z]{2,6}$/,
                                    message: 'Некорректный электронный адрес',
                                },
                            })}
                            title="Ваш адрес электронной почты, например 'example@gmail.com'"
                            placeholder="Email *"
                            autoComplete="false"
                        />
                        <div className={s.error}>
                            {errors.email && (
                                <p className={s.errorText}>
                                    {errors.email.message ||
                                        'Некорректный электронный адрес'}
                                </p>
                            )}
                        </div>
                    </label>

                    <label>
                        <input
                            {...register('password', {
                                required: 'Это обязательное поле',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Минимальня длинна пароля - 6 символов',
                                },
                            })}
                            type={isOpenEye ? 'text' : 'password'}
                            title="Ваш пароль. Минимальня длинна 6 символов"
                            placeholder="Пароль *"
                        />
                        <Icon
                            cn={s.icon}
                            icon={isOpenEye ? `eye` : `closedEye`}
                            onClick={showPassword}
                            w={20}
                        />
                        <div className={s.error}>
                            {errors.password && (
                                <p className={s.errorText}>
                                    {errors.password.message ||
                                        'Некорректный пароль'}
                                </p>
                            )}
                        </div>
                    </label>

                    <Button cn={s.btn} type="submit" text="Создать" />
                </form>
                <div className={s.social}>
                    <p className={s.title}>Или войдите с помощью:</p>
                    <a
                        className={s.googleBtn}
                        href={`${process.env.REACT_APP_BASE_URL2}/users/google`}
                    >
                        <Icon icon="google" w={22} />
                        <div>
                            <span className={s.blue}>G</span>
                            <span className={s.red}>o</span>
                            <span className={s.yellow}>o</span>
                            <span className={s.blue}>g</span>
                            <span className={s.green}>l</span>
                            <span className={s.red}>e</span>
                        </div>
                    </a>

                    <a
                        className={s.facebookBtn}
                        href={`${process.env.REACT_APP_BASE_URL2}/users/facebook`}
                    >
                        <Icon icon="facebook" w={30} />
                        facebook
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
