import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Rectangle } from 'recharts'
import { useWorkingCapital } from '../hooks/useDashboardData'
import { formatCurrency } from '@/utils/formatCurrency'
import { ChevronDown } from 'lucide-react'

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col items-center -translate-x-1/2 -translate-y-2">
        <div className="bg-[#F3F6F8] border border-[#DDE2E5] px-[10px] py-[6px] rounded-[5px] shadow-lg flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <span 
              key={index}
              style={{ 
                fontFamily: 'Kumbh Sans', 
                fontSize: '12px', 
                fontWeight: 500, 
                lineHeight: '100%',
                color: '#1B212D'
              }}
            >
              {formatCurrency(entry.value)}
            </span>
          ))}
        </div>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#F3F6F8]" />
      </div>
    )
  }
  return null
}

const CustomCursor = (props: any) => {
  const { x, y, height } = props
  return (
    <Rectangle 
      fill="#F0F3F6" 
      fillOpacity={0.4} 
      x={x - 20} 
      y={y} 
      width={40} 
      height={height + 25} 
      radius={[10, 10, 10, 10]} 
    />
  )
}

const WorkingCapitalChart = () => {
  const { data: apiData, isLoading } = useWorkingCapital()
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isLoading || !apiData) {
    return <div className="w-full h-[300px] lg:h-[291px] bg-white rounded-[10px] animate-pulse" />
  }

  return (
    <div 
      ref={containerRef}
      className="w-full xl:max-w-[716px] h-[380px] sm:h-[320px] lg:h-[291px] bg-white rounded-[10px] border border-[#F5F5F5] pt-[15px] pb-[21px] px-4 sm:pl-[25px] sm:pr-[20px] flex flex-col overflow-visible transition-all"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[20px] gap-4">
        <h2 className="text-[16px] sm:text-[18px] font-bold text-brand-dark">Working Capital</h2>
        
        <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-[30px] gap-y-[10px] w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 sm:gap-[30px]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#1A7D64]" />
              <span className="text-[11px] sm:text-[12px] font-medium text-brand-gray">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-lime" />
              <span className="text-[11px] sm:text-[12px] font-medium text-brand-gray">Expenses</span>
            </div>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 border border-[#F1F1F1] rounded-[6px] hover:bg-gray-50 transition-all shrink-0">
            <span className="text-[12px] font-medium text-brand-dark">Last 6 Months</span>
            <ChevronDown size={14} className="text-brand-gray" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={apiData} 
            margin={{ top: 6, right: 10, left: isMobile ? 35 : 56, bottom: 20 }}
            onMouseMove={(e: any) => { if (e.activeLabel) setActiveMonth(e.activeLabel) }}
            onMouseLeave={() => setActiveMonth(null)}
          >
            {apiData?.map((d: { month: string }) => (
              <ReferenceLine key={d.month} x={d.month} stroke="#F2F2F2" strokeWidth={1} />
            ))}

            <YAxis 
              width={isMobile ? 10 : 5} 
              axisLine={false} 
              tickLine={false} 
              tick={{ 
                fill: '#929EAE', 
                fontSize: isMobile ? 10 : 12, 
                textAnchor: 'start', 
                dx: isMobile ? -28 : -45, 
                dy: 4 
              }} 
              tickFormatter={(value) => `${Math.round(value / 1000)}K`}
            />

            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              height={35}
              interval={0}
              tick={(props) => {
                const { x, y, payload } = props;
                const isActive = payload.value === activeMonth;
                const displayText = containerWidth < 400 ? payload.value.substring(0, 3) : payload.value;
                
                return (
                  <text 
                    x={x} 
                    y={y} 
                    dy={14} 
                    fill={isActive ? "#1B212D" : "#929EAE"} 
                    fontSize={isMobile ? 10 : 12} 
                    fontWeight={isActive ? 700 : 400} 
                    textAnchor="middle" 
                    style={{ fontFamily: 'Kumbh Sans' }}
                    transform={containerWidth < 380 ? `rotate(-20, ${x}, ${y + 10})` : ""}
                  >
                    {displayText}
                  </text>
                );
              }}
            />

            <Tooltip 
              content={<CustomTooltip />} 
              cursor={<CustomCursor />} 
              position={{ y: 10 }} 
              allowEscapeViewBox={{ x: true, y: true }} 
            />

            <Line type="monotone" dataKey="income" stroke="#29A073" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#1A7D64', stroke: '#fff', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="expense" stroke="#C8EE44" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#C8EE44', stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default WorkingCapitalChart