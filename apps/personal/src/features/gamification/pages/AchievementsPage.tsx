import BaseLayout from '@/shared/layouts/BaseLayout'
import { Progress } from '@/shared/components/ui/Progress'
import { Icon } from '@/shared/components/ui/Icon'
import { Badge } from '@/shared/components/ui/Badge'
import { Ribbon } from '@/shared/components/ui/Ribbon'
import { Avatar } from '@/shared/components/ui/Avatar'

export default function AchievementsPage() {
  const stats = [
    { label: 'Current Rank', value: 'Silver III', icon: 'trophy', color: 'blue' },
    { label: 'Total XP', value: '12,450', icon: 'star', color: 'yellow' },
    { label: 'Badges', value: '18/45', icon: 'award', color: 'green' },
    { label: 'Longest Streak', value: '12 Days', icon: 'flame', color: 'red' },
  ]

  const achievements = [
    {
      id: 1,
      title: 'Smart Saver',
      description: 'Save 20% of your income for 3 months in a row.',
      progress: 66,
      target: '3 Months',
      current: '2 Months',
      status: 'unlocked',
      rarity: 'Rare',
      icon: 'pig-money',
      color: 'green',
      streak: '2 Months',
    },
    {
      id: 2,
      title: 'Budget Master',
      description: 'Keep all your spending categories within budget for a month.',
      progress: 100,
      target: '1 Month',
      current: '1 Month',
      status: 'completed',
      rarity: 'Epic',
      icon: 'target-arrow',
      color: 'purple',
    },
    {
      id: 3,
      title: 'Debt Killer',
      description: 'Pay off a credit card balance in full.',
      progress: 45,
      target: '$5,000',
      current: '$2,250',
      status: 'unlocked',
      rarity: 'Legendary',
      icon: 'sword',
      color: 'red',
    },
    {
      id: 4,
      title: 'Investor Pro',
      description: 'Diversify your portfolio across 5 different asset classes.',
      progress: 20,
      target: '5 Classes',
      current: '1 Class',
      status: 'unlocked',
      rarity: 'Rare',
      icon: 'chart-pie',
      color: 'azure',
    },
    {
      id: 5,
      title: 'Early Bird',
      description: 'Log in and track your expenses before 9 AM for 7 days.',
      progress: 0,
      target: '7 Days',
      current: '0 Days',
      status: 'locked',
      rarity: 'Common',
      icon: 'sun',
      color: 'orange',
      streak: '0 Days',
    },
    {
      id: 6,
      title: 'Wealth Creator',
      description: 'Increase your total net worth by 10% in a single quarter.',
      progress: 85,
      target: '10%',
      current: '8.5%',
      status: 'unlocked',
      rarity: 'Epic',
      icon: 'trending-up',
      color: 'teal',
    },
    {
      id: 7,
      title: 'Subscription Ninja',
      description: 'Identify and cancel 3 unused subscription services.',
      progress: 100,
      target: '3 Services',
      current: '3 Services',
      status: 'completed',
      rarity: 'Common',
      icon: 'cut',
      color: 'pink',
    },
    {
      id: 8,
      title: 'Charity Champ',
      description: 'Donate to 3 different charitable organizations.',
      progress: 33,
      target: '3 Orgs',
      current: '1 Org',
      status: 'unlocked',
      rarity: 'Rare',
      icon: 'heart',
      color: 'red',
    },
    {
      id: 9,
      title: 'Emergency Fund',
      description: 'Save $1,000 in your emergency fund.',
      progress: 75,
      target: '$1,000',
      current: '$750',
      status: 'unlocked',
      rarity: 'Legendary',
      icon: 'shield-check',
      color: 'green',
    },
    {
      id: 10,
      title: 'Tax Optimizer',
      description: 'Maximize your tax-deductible contributions for the year.',
      progress: 0,
      target: 'Maximized',
      current: '0%',
      status: 'locked',
      rarity: 'Epic',
      icon: 'receipt-tax',
      color: 'indigo',
    },
    {
      id: 11,
      title: 'Portfolio Balanced',
      description: 'Keep your asset allocation within 5% of your target.',
      progress: 90,
      target: 'Within 5%',
      current: 'Within 2%',
      status: 'completed',
      rarity: 'Rare',
      icon: 'scale',
      color: 'cyan',
    },
    {
      id: 12,
      title: 'Credit Score Pro',
      description: 'Maintain a credit score above 750 for 6 months.',
      progress: 50,
      target: '6 Months',
      current: '3 Months',
      status: 'unlocked',
      rarity: 'Legendary',
      icon: 'credit-card',
      color: 'yellow',
      streak: '3 Months',
    },
  ]

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', xp: '24,500', avatar: 'AJ', src: '000m.jpg' },
    { rank: 2, name: 'Sarah Miller', xp: '21,200', avatar: 'SM', src: '001f.jpg' },
    { rank: 3, name: 'You', xp: '12,450', avatar: 'ME', isMe: true, src: '002m.jpg' },
    { rank: 4, name: 'Michael Chen', xp: '11,800', avatar: 'MC', src: '003m.jpg' },
    { rank: 5, name: 'Emma Wilson', xp: '10,500', avatar: 'EW', src: '004f.jpg' },
    { rank: 6, name: 'David Kim', xp: '9,200', avatar: 'DK', src: '005m.jpg' },
    { rank: 7, name: 'Jessica Lee', xp: '8,450', avatar: 'JL', src: '006f.jpg' },
    { rank: 8, name: 'Tom Hardy', xp: '7,800', avatar: 'TH', src: '007m.jpg' },
    { rank: 9, name: 'Linda Song', xp: '7,200', avatar: 'LS', src: '008f.jpg' },
    { rank: 10, name: 'Kevin Hart', xp: '6,500', avatar: 'KH', src: '009m.jpg' },
  ]

  return (
    <BaseLayout pageTitle="Achievements Hub" pagePretitle="GAMIFICATION">
      <div className="row g-4">
        <div className="col-12">
          <div className="row g-3">
            {stats.map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm h-100 rounded-4">
                  <div className="card-body p-2 px-3">
                    <div className="d-flex align-items-center">
                      <div
                        className={`bg-${stat.color} p-2 rounded-4 me-3 shadow-sm d-flex align-items-center justify-content-center`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        <Icon icon={stat.icon} size="md" color="white" />
                      </div>
                      <div>
                        <div className="text-muted" style={{ fontSize: '11px', lineHeight: '1' }}>
                          {stat.label}
                        </div>
                        <div className="h4 mb-0 fw-bold">{stat.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-header border-0 bg-transparent py-3">
              <div className="d-flex align-items-center justify-content-between w-100">
                <h3 className="card-title mb-0">Your Achievements</h3>
                <div className="dropdown">
                  <button className="btn btn-ghost-secondary btn-sm dropdown-toggle" type="button">
                    All Categories
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {achievements.map((item) => (
                  <div
                    key={item.id}
                    className={`list-group-item py-2 px-3 border-0 ${item.status === 'locked' ? 'opacity-50' : ''}`}
                  >
                    <div className="row g-3 align-items-center">
                      <div className="col-auto">
                        <div
                          className={`avatar avatar-md rounded-4 bg-${item.color} text-white shadow-sm`}
                        >
                          <Icon icon={item.icon} size="md" />
                        </div>
                      </div>
                      <div className="col">
                        <div className="d-flex align-items-center mb-0">
                          <h5 className="mb-0 me-2">{item.title}</h5>
                          <Badge
                            color={
                              item.rarity === 'Legendary'
                                ? 'yellow'
                                : item.rarity === 'Epic'
                                  ? 'purple'
                                  : 'azure'
                            }
                            pill
                          >
                            {item.rarity}
                          </Badge>
                          {item.streak && (
                            <Badge
                              color="red"
                              light
                              pill
                              className="ms-2"
                              style={{ fontSize: '9px' }}
                            >
                              <Icon icon="flame" size="xxs" className="me-1" />
                              {item.streak} Streak
                            </Badge>
                          )}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: '11px', marginBottom: '8px' }}
                        >
                          {item.description}
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="flex-fill me-3">
                            <Progress value={item.progress} size="xs" color={item.color} />
                          </div>
                          <div className="fw-bold text-nowrap" style={{ fontSize: '10px' }}>
                            {item.current} / {item.target}
                          </div>
                        </div>
                      </div>
                      <div className="col-auto">
                        {item.status === 'completed' ? (
                          <div className="text-success">
                            <Icon icon="circle-check" size="md" />
                          </div>
                        ) : item.status === 'locked' ? (
                          <div className="text-muted">
                            <Icon icon="lock" size="md" />
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1"
                            style={{ fontSize: '11px' }}
                          >
                            Claim 50 XP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column h-100 gap-3">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-body text-center p-3">
                <div className="position-absolute top-0 end-0 p-2">
                  <Badge color="green" light pill style={{ fontSize: '10px' }}>
                    ACTIVE
                  </Badge>
                </div>
                <div
                  className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px' }}
                >
                  <img
                    src="/static/illustrations/streak/pet.gif"
                    alt="Mora Mascot"
                    className="img-fluid"
                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 className="mb-0">Mora the Spirit</h4>
                <p className="text-muted mb-3" style={{ fontSize: '11px' }}>
                  Level 12 • Happy & Energized
                </p>
                <div className="p-2 bg-body-tertiary rounded-3 d-inline-flex align-items-center">
                  <Badge color="red" pill className="me-2">
                    <Icon icon="flame" size="xxs" className="me-1" />
                    12 Days
                  </Badge>
                  <span className="small fw-bold text-muted" style={{ fontSize: '10px' }}>
                    Keep it up to evolve!
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-fill">
              <div className="card border-0 shadow-sm overflow-hidden h-100 rounded-4">
                <Ribbon color="yellow" icon="trophy" />
                <div className="card-header border-0 bg-transparent py-2">
                  <h3 className="card-title mb-0">Weekly Leaderboard</h3>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {leaderboard.map((user) => (
                      <div
                        key={user.rank}
                        className={`list-group-item d-flex align-items-center py-2 px-3 border-0 ${user.isMe ? 'bg-primary-lt' : ''}`}
                      >
                        <div className="me-3 fw-bold text-muted" style={{ width: '20px' }}>
                          {user.rank}
                        </div>
                        <div className="me-3">
                          <Avatar
                            src={user.src}
                            placeholder={user.avatar}
                            size="sm"
                            shape="rounded-4"
                            className="shadow-sm"
                          />
                        </div>
                        <div className="flex-fill">
                          <div className={`fw-bold small ${user.isMe ? 'text-primary' : ''}`}>
                            {user.name}
                          </div>
                          <div className="text-muted" style={{ fontSize: '10px' }}>
                            Tier 1 Saver
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold small">{user.xp}</div>
                          <div className="text-muted" style={{ fontSize: '10px' }}>
                            XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-footer border-0 bg-transparent text-center pb-3">
                  <button className="btn btn-ghost-primary btn-sm w-100">View Full Rankings</button>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div
                className="card border-0 bg-dark text-white shadow-sm overflow-hidden rounded-4"
                style={{ minHeight: '150px' }}
              >
                <div className="card-body d-flex flex-column justify-content-between p-3 position-relative">
                  <div className="position-absolute top-0 end-0 p-3 opacity-20">
                    <Icon icon="crown" size={60} />
                  </div>
                  <div>
                    <Badge color="yellow" className="mb-1" style={{ fontSize: '9px' }}>
                      EXCLUSIVE
                    </Badge>
                    <h4 className="fw-bold mb-1">Mora Elite Skin</h4>
                    <p className="small text-white-50">
                      Unlock a premium theme for your dashboard by completing 5 Epic achievements.
                    </p>
                  </div>
                  <div>
                    <button className="btn btn-white btn-sm rounded-pill px-4 fw-bold">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
