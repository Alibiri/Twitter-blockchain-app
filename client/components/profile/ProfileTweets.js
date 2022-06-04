import Post from '../Post'
import { useContext } from 'react'
import { TwitterContext } from '../../context/TwitterContext'
const style = {
    wrapper: `no-scrollbar`,
    header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
    headerTitle: `text-xl font-bold`,
  }
  const tweets =[
    {
    displayName: 'Ali',
    userName: '04vyyf4fgf678Jgffg65dd876mlnh6542dx23bh9H',
    avatar :'https://us.123rf.com/450wm/moremar/moremar1706/moremar170600011/81168217-portrait-of-an-african-man-the-face-of-a-guy-avatar-for-the-internet-vector-illustration.jpg?ver=6',
    text:' Good morining everyone',
    isProfileImageNft: false,
    timestamp: '2022-04-01T12:00:00.000Z',
    },
    {
      displayName: 'Ali',
      userName: '04vyyf4fgf678Jgffg65dd876mlnh6542dx23bh9H',
      avatar :'https://us.123rf.com/450wm/moremar/moremar1706/moremar170600011/81168217-portrait-of-an-african-man-the-face-of-a-guy-avatar-for-the-internet-vector-illustration.jpg?ver=6',
      text:' look my new shoes',
      isProfileImageNft: false,
      timestamp: '2022-03-01T14:00:00.000Z',
      },
      {
          displayName: 'Ali',
          userName: '04vyyf4fgf678Jgffg65dd876mlnh6542dx23bh9H',
          avatar :'https://us.123rf.com/450wm/moremar/moremar1706/moremar170600011/81168217-portrait-of-an-african-man-the-face-of-a-guy-avatar-for-the-internet-vector-illustration.jpg?ver=6',
          text:'finaly succed',
          isProfileImageNft: false,
          timestamp: '2021-04-01T20:00:00.000Z',
          },
          {
              displayName: 'Ali',
              userName: '04vyyf4fgf678Jgffg65dd876mlnh6542dx23bh9H',
              avatar :'https://us.123rf.com/450wm/moremar/moremar1706/moremar170600011/81168217-portrait-of-an-african-man-the-face-of-a-guy-avatar-for-the-internet-vector-illustration.jpg?ver=6',
              text:' in my first job work place',
              isProfileImageNft: false,
              timestamp: '2020-05-01T12:00:00.000Z',
              }
]
const ProfileTweets = () => {
  const {currentAccount, currentUser} = useContext(TwitterContext)
  return (
    <div className={style.wrapper}>
        {currentUser.tweets?.map((tweet, index) => (
            <Post
            key={index}
            displayName={currentUser.name === 'Unnamed' ? currentUser.walletAddress : currentUser.name}
            userName={`${currentAccount.slice(0, 4)}...${currentAccount.slice(-4)}`}
            text={tweet.tweet}
            avatar={currentUser.profileImage}
            isProfileImageNft={tweet.isProfileImageNft}
            timestamp={tweet.timestamp}/>
        ))}
    </div>
  )
}

export default ProfileTweets