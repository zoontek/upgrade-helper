import styled from '@emotion/styled'
import { Card, Input, Typography } from 'antd'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import GitHubButton from 'react-github-btn'
import logo from '../../assets/logo.svg'
import { DEFAULT_APP_NAME, PACKAGE_NAMES } from '../../constants'
import { useGetLanguageFromURL } from '../../hooks/get-language-from-url'
import { useGetPackageNameFromURL } from '../../hooks/get-package-name-from-url'
import { SHOW_LATEST_RCS } from '../../utils'
import { deviceSizes } from '../../utils/device-sizes'
import { updateURL } from '../../utils/update-url'
import DiffViewer from '../common/DiffViewer'
import Settings from '../common/Settings'
import { TroubleshootingGuidesButton } from '../common/TroubleshootingGuidesButton'
import VersionSelector from '../common/VersionSelector'

const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 30px;
`

const Container = styled(Card)`
  width: 90%;
  border-radius: 3px;
  border-color: #e8e8e8;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${deviceSizes.tablet} {
    flex-direction: row;
  }
`

const LogoImg = styled.img`
  width: 50px;
  margin-bottom: 15px;

  @media ${deviceSizes.tablet} {
    width: 100px;
  }
`

const TitleHeader = styled.h1`
  margin: 0;
  margin-left: 15px;
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const SettingsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 8px;
  flex: 1;
`

const StarButton = styled(({ className, ...props }) => (
  <div className={className}>
    <GitHubButton {...props} />
  </div>
))`
  margin-top: 10px;
  margin-left: 15px;
  margin-right: auto;
`

const Home = () => {
  const { packageName: defaultPackageName, isPackageNameDefinedInURL } =
    useGetPackageNameFromURL()
  const defaultLanguage = useGetLanguageFromURL()
  const [packageName, setPackageName] = useState(defaultPackageName)
  const [language, setLanguage] = useState(defaultLanguage)
  const [fromVersion, setFromVersion] = useState('')
  const [toVersion, setToVersion] = useState('')
  const [shouldShowDiff, setShouldShowDiff] = useState(false)
  const [settings, setSettings] = useState({
    [`${SHOW_LATEST_RCS}`]: false,
  })

  const [appName, setAppName] = useState({
    input: '',
    diff: DEFAULT_APP_NAME,
  })

  const homepageUrl = process.env.PUBLIC_URL

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.initialize('UA-136307971-1')
      ReactGA.pageview('/')
    }
  }, [])

  const handleShowDiff = ({ fromVersion, toVersion }) => {
    if (fromVersion === toVersion) {
      return
    }

    setAppName(({ input }) => ({
      input: '',
      diff: input || DEFAULT_APP_NAME,
    }))

    setFromVersion(fromVersion)
    setToVersion(toVersion)
    setShouldShowDiff(true)
  }

  const handlePackageNameAndLanguageChange = ({
    newPackageName,
    newLanguage,
  }) => {
    let localPackageName =
      newPackageName === undefined ? packageName : newPackageName
    let localLanguage = newLanguage === undefined ? language : newLanguage

    updateURL({
      packageName: localPackageName,
      language: localLanguage,
      isPackageNameDefinedInURL:
        isPackageNameDefinedInURL || newPackageName !== undefined,
      toVersion: '',
      fromVersion: '',
    })
    setPackageName(localPackageName)
    setLanguage(localLanguage)
    setFromVersion('')
    setToVersion('')
    setShouldShowDiff(false)
  }

  const handleSettingsChange = (settingsValues) => {
    const normalizedIncomingSettings = settingsValues.reduce((acc, val) => {
      acc[val] = true
      return acc
    }, {})

    setSettings(normalizedIncomingSettings)
  }

  return (
    <Page>
      <Container>
        <HeaderContainer>
          <TitleContainer>
            <LogoImg
              alt="React Native Upgrade Helper logo"
              title="React Native Upgrade Helper logo"
              src={logo}
            />
            <a href={homepageUrl}>
              <TitleHeader>React Native Upgrade Helper</TitleHeader>
            </a>
          </TitleContainer>

          <SettingsContainer>
            <StarButton
              href="https://github.com/react-native-community/upgrade-helper"
              data-icon="octicon-star"
              data-show-count="true"
              aria-label="Star react-native-community/upgrade-helper on GitHub"
            >
              Star
            </StarButton>
            {packageName === PACKAGE_NAMES.RN && (
              <TroubleshootingGuidesButton />
            )}
            <Settings
              handleSettingsChange={handleSettingsChange}
              packageName={packageName}
              onChangePackageNameAndLanguage={
                handlePackageNameAndLanguageChange
              }
              language={language}
            />
          </SettingsContainer>
        </HeaderContainer>

        <Typography.Title level={5}>What's your app name?</Typography.Title>

        <Input
          size="large"
          placeholder={DEFAULT_APP_NAME}
          value={appName.input}
          onChange={({ target }) =>
            setAppName(({ diff }) => ({ input: target.value, diff }))
          }
        />

        <VersionSelector
          key={packageName}
          showDiff={handleShowDiff}
          showReleaseCandidates={settings[SHOW_LATEST_RCS]}
          packageName={packageName}
          language={language}
          isPackageNameDefinedInURL={isPackageNameDefinedInURL}
        />
      </Container>
      <DiffViewer
        shouldShowDiff={shouldShowDiff}
        fromVersion={fromVersion}
        toVersion={toVersion}
        appName={appName.diff}
        packageName={packageName}
        language={language}
      />
    </Page>
  )
}

export default Home
