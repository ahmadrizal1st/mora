
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Progress } from '@/shared/components/ui/Progress'
import { Icon } from '@/shared/components/ui/Icon'
import { Badge } from '@/shared/components/ui/Badge'
import { Ribbon } from '@/shared/components/ui/Ribbon'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useGamificationStats, useAchievements, useLeaderboard, useClaimAchievement } from '../hooks/useGamification'
import type { Achievement } from '../types/gamification.types'

export default function AchievementsPage() {
  const { data: statsData, isLoading: isStatsLoading } = useGamificationStats()
  const { data: achievementsData, isLoading: isAchievementsLoading } = useAchievements()
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useLeaderboard()
  const claimMutation = useClaimAchievement()

  const handleClaim = (id: string | number) => {
    claimMutation.mutate(id)
  }

  const isLoading = isStatsLoading || isAchievementsLoading || isLeaderboardLoading

  if (isLoading) {
    return (
      <BaseLayout pageTitle="Achievements Hub" pagePretitle="GAMIFICATION">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </BaseLayout>
    )
  }

  const stats = [
    { label: 'Current Rank', value: statsData?.current_rank || '-', icon: 'trophy', color: 'blue' },
    { label: 'Total XP', value: statsData?.total_xp?.toLocaleString() || '0', icon: 'star', color: 'yellow' },
    { label: 'Badges', value: `${statsData?.total_badges || 0}/${statsData?.total_achievements || 0}`, icon: 'award', color: 'green' },
    { label: 'Longest Streak', value: `${statsData?.longest_streak || 0} Days`, icon: 'flame', color: 'red' },
  ]

  const achievements: Achievement[] = achievementsData || []
  const leaderboard = leaderboardData || []



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
                            {item.current_label} / {item.target_label}
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
                            onClick={() => handleClaim(item.id)}
                            disabled={claimMutation.isPending}
                          >
                            {claimMutation.isPending ? '...' : `Claim ${item.reward_xp} XP`}
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
                    src={statsData?.pet?.image || "/static/illustrations/streak/pet.gif"}
                    alt="Morapi Mascot"
                    className="img-fluid"
                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <h4 className="mb-0">{statsData?.pet?.name || "Morapi the Spirit"}</h4>
                <p className="text-muted mb-3" style={{ fontSize: '11px' }}>
                  Level {statsData?.pet?.level || 1} • {statsData?.pet?.status || "Happy & Energized"}
                </p>
                <div className="p-2 bg-body-tertiary rounded-3 d-inline-flex align-items-center">
                  <Badge color="red" pill className="me-2">
                    <Icon icon="flame" size="xxs" className="me-1" />
                    {statsData?.current_streak || 0} Days
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
                            src={user.src || undefined}
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
                    <h4 className="fw-bold mb-1">Morapi Elite Skin</h4>
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
