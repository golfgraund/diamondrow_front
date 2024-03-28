import '@/assets/styles/app.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import css from '@/components/app/App.module.scss';
import { AppRoute } from '@/app-routes.ts';
import { MosaicDebug } from '@/components/debug/MosaicDebug.tsx';
import { Sprite } from '@/components/icons/Sprite.tsx';
import { Popup } from '@/components/popup/Popup.tsx';
import { PopupButton } from '@/components/popup/PopupButton/PopupButton.tsx';
import { MainScreen } from '@/components/screens/MainScreen/MainScreen';
import { PreviewScreen } from '@/components/screens/PreviewScreen/PreviewScreen.tsx';
import { ScreenCode } from '@/components/screens/ScreenCode/ScreenCode.tsx';
import { ScreenConstructor } from '@/components/screens/ScreenConstructor/ScreenConstructor.tsx';
import { ScreenEmail } from '@/components/screens/ScreenEmail/ScreenEmail.tsx';
import { ScreenFilters } from '@/components/screens/ScreenFilters/ScreenFilters.tsx';
import { ScreenFinal } from '@/components/screens/ScreenFinal/ScreenFinal.tsx';
import { ScreenFraming } from '@/components/screens/ScreenFraming/ScreenFraming.tsx';
import { ScreenInstructions } from '@/components/screens/ScreenInstructions/ScreenInstructions.tsx';
import { ScreenSizeColor } from '@/components/screens/ScreenSizeColor/ScreenSizeColor.tsx';
import { ScreenUploadPhoto } from '@/components/screens/ScreenUploadPhoto/ScreenUploadPhoto.tsx';
import { UiScreen } from '@/components/screens/UIScreen/UIScreen';

export function App() {
  return (
    <div className={css.app}>
      <Sprite />
      <BrowserRouter>
        <Routes>
          <Route path={AppRoute.Main} element={<MainScreen />} />
          <Route path={AppRoute.StepCode} element={<ScreenCode />} />
          <Route path={AppRoute.StepColorSize} element={<ScreenSizeColor />} />
          <Route path={AppRoute.StepUploadPhoto} element={<ScreenUploadPhoto />} />
          <Route path={AppRoute.StepFraming} element={<ScreenFraming />} />
          <Route path={AppRoute.StepFilters} element={<ScreenFilters />} />
          <Route path={AppRoute.StepEmail} element={<ScreenEmail />} />
          <Route path={AppRoute.StepFinal} element={<ScreenFinal />} />
          <Route path={AppRoute.Instruction} element={<ScreenInstructions />} />
          <Route path={AppRoute.Constructor} element={<ScreenConstructor />} />
          <Route path={AppRoute.Preview} element={<PreviewScreen />} />
          <Route path={AppRoute.UI} element={<UiScreen />} />
          <Route path={AppRoute.DebugPhotos} element={<MosaicDebug />} />
        </Routes>
      </BrowserRouter>

      <PopupButton className={css.popupButton} />
      <Popup />
    </div>
  );
}
