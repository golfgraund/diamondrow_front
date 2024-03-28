import { clsx } from 'clsx';
import css from './UiScreen.module.scss';
import { Header } from '@/components/header/Header.tsx';
import { PrimaryButton } from '@/components/ui/buttons/PrimaryButton/PrimaryButton.tsx';
import { SecondaryButton } from '@/components/ui/buttons/SecondaryButton/SecondaryButton.tsx';
import { Input } from '@/components/ui/input/Input.tsx';

export const UiScreen = () => (
  <section className={clsx(css.section)}>
    <Header />
    <div className={clsx(css.wrap, 'wrapper')}>
      <h1>UI компоненты</h1>
      <hr />
      <h2 className="h1">Заголовок 1 уровня</h2>
      <h2>Заголовок 2 уровня</h2>
      <div className="text-l">
        <p className="fw-light">текст L light</p>
        <p className="fw-medium">текст L medium</p>
        <p className="fw-bold">текст L Bold</p>
      </div>
      <div className="text-m">
        <p className="fw-light">текст M light</p>
        <p className="fw-medium">текст M medium</p>
        <p className="fw-bold">текст M Bold</p>
      </div>
      <div className="text-s">
        <p className="fw-light">текст S light</p>
        <p className="fw-medium">текст S medium</p>
        <p className="fw-bold">текст S Bold</p>
      </div>
      <p className="mosaic">мозайка - на мобиле меньше, на десктопе больше</p>
      <p className="mosaic-big">мозайка - всегда большой</p>
      <hr />
      <div className={css.buttons}>
        <h2> primary кнопки</h2>
        <br />
        <PrimaryButton className={css.button} text="кнопка без иконки" />
        <PrimaryButton className={css.button} text="кнопка с иконкой" icon="pdf" />
        <br />
        <p>disabled primary кнопки</p>
        <PrimaryButton className={css.button} text="кнопка без иконки disabled" disabled />
        <PrimaryButton
          className={css.button}
          text="кнопка с иконкой disabled"
          icon="pdf"
          disabled
        />
        <br />
        <p>primary кнопки с ошибкой</p>
        <PrimaryButton className={css.button} text="кнопка без иконки" error="текст ошибки" />
        <PrimaryButton
          className={css.button}
          text="кнопка с иконкой"
          error="текст ошибки"
          icon="pdf"
        />
      </div>

      <hr />
      <div className={css.buttons}>
        <h2>secondary кнопки c текстом</h2>
        <br />
        <SecondaryButton className={css.button} text="secondary кнопка c текстом" />
        <SecondaryButton className={css.button} text="secondary кнопка c текстом" disabled />
        <SecondaryButton className={css.button} text="сбросить" small />
        <SecondaryButton className={css.button} text="сбросить" small disabled />

        <p>c иконками</p>
        <div className={css.icons}>
          <SecondaryButton className={css.button} icon="plus" />
          <SecondaryButton className={css.button} icon="minus" />
          <SecondaryButton className={css.button} icon="rotate" />
          <SecondaryButton className={css.button} icon="tap" />
          <SecondaryButton className={css.button} icon="vertical-orienation" />
          <SecondaryButton className={css.button} icon="horizontal-orientation" />
          <SecondaryButton className={css.button} icon="arrow-left" />
          <SecondaryButton className={css.button} icon="arrow-right" />
        </div>
        <div className={css.icons}>
          <SecondaryButton className={css.button} icon="plus" small />
          <SecondaryButton className={css.button} icon="minus" small />
          <SecondaryButton className={css.button} icon="rotate" small />
          <SecondaryButton className={css.button} icon="tap" small />
          <SecondaryButton className={css.button} icon="vertical-orienation" small />
          <SecondaryButton className={css.button} icon="horizontal-orientation" small />
          <SecondaryButton className={css.button} icon="arrow-left" small />
          <SecondaryButton className={css.button} icon="arrow-right" small />
        </div>
        <div className={css.icons}>
          <SecondaryButton className={css.button} icon="plus" disabled />
          <SecondaryButton className={css.button} icon="minus" disabled />
          <SecondaryButton className={css.button} icon="rotate" disabled />
          <SecondaryButton className={css.button} icon="tap" disabled />
          <SecondaryButton className={css.button} icon="vertical-orienation" disabled />
          <SecondaryButton className={css.button} icon="horizontal-orientation" disabled />
          <SecondaryButton className={css.button} icon="arrow-left" disabled />
          <SecondaryButton className={css.button} icon="arrow-right" disabled />
        </div>
        <div className={css.icons}>
          <SecondaryButton className={css.button} icon="plus" small disabled />
          <SecondaryButton className={css.button} icon="minus" small disabled />
          <SecondaryButton className={css.button} icon="rotate" small disabled />
          <SecondaryButton className={css.button} icon="tap" small disabled />
          <SecondaryButton className={css.button} icon="vertical-orienation" small disabled />
          <SecondaryButton className={css.button} icon="horizontal-orientation" small disabled />
          <SecondaryButton className={css.button} icon="arrow-left" small disabled />
          <SecondaryButton className={css.button} icon="arrow-right" small disabled />
        </div>
      </div>

      <div className={css.inputs}>
        <Input className={css.input} placeholder="example@mail.ru" />
        <Input className={css.input} type="number" placeholder="000-000-000" error="asdasda" />
        <Input className={css.input} type="number" placeholder="000-000-000" disabled />
      </div>
    </div>
  </section>
);
