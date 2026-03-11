interface FriendListProps {
  children: React.ReactNode
}

export default function FriendList({ children }: FriendListProps) {
  return (
    // TODO  why必须有<> </> 
    <>  {children}</>

  )

}