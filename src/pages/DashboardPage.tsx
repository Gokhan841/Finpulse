import DashboardLayout from '@/components/layout/DashboardLayout'
import ErrorBoundary from '@/components/ErrorBoundary'
import StatsGroup from '@/features/dashboard/components/StatsGroup'
import CapitalChart from '@/features/dashboard/components/CapitalChart'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions'
import ScheduledTransfers from '@/features/dashboard/components/ScheduledTransfers'
import WalletCards from '@/components/WalletCards'

function DashboardPage() {
  return (
    <DashboardLayout>
      <ErrorBoundary>
 
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-[30px] w-full min-w-[320px] items-start">
         <section className="flex flex-col gap-6 xl:gap-[30px] flex-1 min-w-0 lg:max-w-[716px] xl:max-w-[716px] w-full">
            <StatsGroup />
            <CapitalChart />
            <RecentTransactions />
          </section>
          <aside
            className={`
              flex gap-6 min-w-0 w-full overflow-hidden
              flex-col items-start
              min-[640px]:flex-row min-[640px]:flex-nowrap min-[640px]:items-start min-[640px]:justify-start
              lg:flex-col lg:items-stretch lg:w-[300px] lg:gap-6
              xl:w-[354px] xl:gap-[30px]
              [&>*:first-child]:w-[300px] [&>*:first-child]:shrink-0 [&>*:first-child]:mx-auto
              [&>*:first-child]:min-[480px]:w-[354px]
              [&>*:first-child]:min-[640px]:w-[300px] [&>*:first-child]:min-[640px]:mx-0
              [&>*:first-child]:min-[768px]:w-[354px]
              lg:[&>*:first-child]:w-full lg:[&>*:first-child]:min-w-0 lg:[&>*:first-child]:mx-0
              [&>*:last-child]:w-full [&>*:last-child]:min-w-0
              min-[640px]:[&>*:last-child]:flex-1 min-[640px]:[&>*:last-child]:max-w-none
              lg:[&>*:last-child]:flex-initial lg:[&>*:last-child]:max-w-full
            `}
          >
            <WalletCards />
            <ScheduledTransfers />
          </aside>
          
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  )
}

export default DashboardPage