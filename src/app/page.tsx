
'use client'

import styles from "./page.module.css";
import { useEffect, useState  } from "react";
import { getNextDayPrediction, getNextWeekPrediction, getDailyChanges, getStartDateOfRecords, getEndDateOfRecords } from '@/services/crypto.service';
import Loader from "@/components/Loader/loader";
import LineChart from "@/components/LineChart/lineChart";

type NextDayPrediction = {
  next_day_price: number 
}

type NextWeekPrediction = {
  next_7_days: Array<number>
}

type DailyChanges = {
  date: string,
  open?: number,
  close: number
}

export default function Home() {
  const [nextDayPrediction, setNextDayPrediction] = useState<NextDayPrediction | null>(null)
  const [nextWeekPrediction, setNextWeekPrediction] = useState<NextWeekPrediction | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [year, setYear] = useState<number>(2025)
  const [month, setMonth] = useState<number>(3)
  const [dailyChanges, setDailyChanges] = useState<Array<DailyChanges>>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [predictValues, setPredictValues] = useState<Array<DailyChanges>>([])
  const [isSinglePredicted, setIsSinglePredicted] = useState<boolean>(false);
  const [isMultiplePredicted, setIsMultiplePredicted] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);

  useEffect(() => {
    const getRecordsDetails = async() => {
      setStartDate('')
      setEndDate('')
      try {
        const recordDetailsStartDate = await getStartDateOfRecords()
        const recordDetailsEndDate = await getEndDateOfRecords()
        setStartDate(recordDetailsStartDate.date)
        setEndDate(recordDetailsEndDate.date)
      }
      catch (err) {
        console.log('getRecordsDetails', err)
        throw err
      }
    }
    getRecordsDetails()
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const fetchDailyChanges = async () => {
      setDailyChanges([])
      try {
        const dailyChanges: Array<DailyChanges> = await getDailyChanges(year, month)
        setDailyChanges(dailyChanges)
        setPredictValues(dailyChanges.slice(-7))
        console.log('dailyChanges', dailyChanges)
      }
      catch (err) {
        console.log('Failed to load daily changes', err)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchDailyChanges()
  }, [])

  const generateChartData = () => {
    const labels: Array<string> = []
    const data: Array<number> = []
    dailyChanges?.forEach(element => {
      labels.push(element.date)
      data.push(element.close)
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Market value',
          data: data,
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: 'rgb(232, 37, 131)',
          tension: 0.4,
        }
      ],
    }
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Ethereum Price Variation in year ${year}`,
          color: '#ffff',
          font: {
            size: 16
          }
        },
      },
      scales: {
        y: {
          // min: 2000,
          // max: 3000,
          grid: {
            display: true,         // 👈 Show Y grid lines
            color: '#444',
            borderDash: [5, 5],
          },
          ticks: {
            stepSize: 10,
            color: 'rgb(232, 60, 37)',
          },
        },
        x: {
          grid: {
            display: true,         // 👈 Show X grid lines
            color: '#444',         // Optional: grid color
            borderDash: [5, 5],    // Optional: dashed lines
          },
          ticks: {
            maxRotation: 40,
            minRotation: 45,
            font: {
              size: 8,
            },
            color: 'rgb(232, 144, 37)',
          },
        },
      },
    };

    return { chartData, options }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (e.target.id=='year') {
      setYear(value)
    }
    else {
      setMonth(value)
    }
  }

  const onBtnClick = () => {
    const fetchDailyChanges = async () => {
      setDailyChanges([])
      try {
        const dailyChanges = await getDailyChanges(year, month)
        setDailyChanges(dailyChanges)
      }
      catch (err) {
        console.log('Failed to load daily changes', err)
      }
      finally {
        //
      }
    }
    fetchDailyChanges()
  }
  //////////////////////////////////////////////////////////////////////////////////////////

  const generatePredictedChartData = () => {
    const labels: Array<string> = []
    const data: Array<number> = []
    predictValues?.forEach(element => {
      labels.push(element.date)
      data.push(element.close)
    });

    /// add predicted value to chart

    const predictedChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Market value',
          data: data,
          borderColor: 'rgb(86, 245, 23)',
          //pointBackgroundColor: 'rgb(0, 30, 255)',
          pointBackgroundColor: data.map((_, i) =>
            i === data.length - 1 ? 'rgb(255, 0, 0)' : 'rgb(0, 30, 255)'
          ),
          tension: 0.4,
        }
      ],
    }
    const PredictedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Ethereum predicted price chart - Next day`,
          color: '#ffff',
          font: {
            size: 16
          }
        },
      },
      scales: {
        y: {
          grid: {
            display: true,         // 👈 Show Y grid lines
            color: '#444',
            borderDash: [5, 5],
          },
          ticks: {
            stepSize: 10,
            color: 'rgb(232, 60, 37)',
          },
        },
        x: {
          grid: {
            display: true,         // 👈 Show X grid lines
            color: '#444',         // Optional: grid color
            borderDash: [5, 5],    // Optional: dashed lines
          },
          ticks: {
            maxRotation: 40,
            minRotation: 45,
            font: {
              size: 8,
            },
            color: 'rgb(232, 144, 37)',
          },
        },
      },
    };

    return { predictedChartData, PredictedChartOptions }
  }

  const onNextDayPredictBtnPress = () => {
    if (isMultiplePredicted) {
      predictValues.splice(-7)
      setPredictValues([...predictValues])
      setIsMultiplePredicted(false)
    }
    const fetchData = async () => {
      try {
        const dayRes = await getNextDayPrediction()

        setNextDayPrediction(dayRes)
        
        const obj: Array<DailyChanges> = predictValues.slice(-1)
        const lastDay = new Date(obj[0].date)
        lastDay.setDate(lastDay.getDate() + 1)
        const nextDay = lastDay.toISOString().split('T')[0]
  
        const predicted: DailyChanges = {
          date: nextDay,
          close: dayRes.next_day_price
        }
        setPredictValues([...predictValues, predicted])
      } catch (err) {
        console.error('Failed to load predictions', err)
      } finally {
        setIsSinglePredicted(true)
      }
      
    }
    fetchData()
  }

  const onNextWeekPredictBtnPress = () => {
    if (isSinglePredicted) {
      predictValues.splice(-1)
      setPredictValues([...predictValues])
      setIsSinglePredicted(false)
    }
    const fetchData = async () => {
      try {
        const predictArr = []
        const weekRes = await getNextWeekPrediction()
        setNextWeekPrediction(weekRes)
        const obj: Array<DailyChanges> = predictValues.slice(-1)
        const lastDay = new Date(obj[0].date)
        for (let i=0; i<7;i++) {
          lastDay.setDate(lastDay.getDate() + 1)
          const nextDay = lastDay.toISOString().split('T')[0]
          const predicted: DailyChanges = {
            date: nextDay,
            close: weekRes.next_7_days[i]
          }
          predictArr.push(predicted)
        }
        setPredictValues([...predictValues, ...predictArr])
      }
      catch (err) {
        console.log('Failed to load predictions', err)
      }
      finally {
        setIsMultiplePredicted(true)
      }
    }
    fetchData()
  }

  const onResetData = () => {
    if (isSinglePredicted) {
      predictValues.splice(-1)
      setPredictValues([...predictValues])
      setIsSinglePredicted(false)
      setIsReset(true)
    }
    if (isMultiplePredicted) {
      predictValues.splice(-7)
      setPredictValues([...predictValues])
      setIsMultiplePredicted(false)
      setIsReset(true)
    }
  }

  if (isLoading) return <Loader/>
  const {chartData, options} = generateChartData()
  const { predictedChartData, PredictedChartOptions } = generatePredictedChartData()
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <div className={styles.recordsWrapper}>
        <div className={styles.recordsInnerWrapper}>
          <h5>Start date of records</h5>
          <h4>{startDate}</h4>
        </div>
        <div className={styles.recordsInnerWrapper}>
          <h5>End date of records</h5>
          <h4>{endDate}</h4>
        </div>
      </div>
      <div style={{ width: '100%', height: '350px' }}>
        <LineChart data={chartData} options={options} />
      </div>
      <div className={styles.inputWrapper}>
        <div className={styles.inputInnerWrapper}>
          <label htmlFor="year" className={styles.inputLabel}>Set a year</label>
          <input 
            id="year" 
            type="text" 
            defaultValue={year.toString()}
            onChange={onInputChange}
            placeholder="Year"
          />
        </div>
        <div className={styles.inputInnerWrapper}>
          <label htmlFor="month" className={styles.inputLabel}>Set a month</label>
          <input 
            id="month" 
            type="text" 
            defaultValue={month.toString()}
            onChange={onInputChange}
            placeholder="Year"
          />
        </div>
        <button onClick={onBtnClick} className={styles.filterBtn}>Filter</button>
      </div>
      <div className={styles.predictedChartWrapper}>
      <div style={{ width: '100%', height: '350px' }}>
        <LineChart data={predictedChartData} options={PredictedChartOptions} />
      </div>
      <div className={styles.btnWrapper}>
        <button onClick={onNextDayPredictBtnPress} className={styles.predictBtn}>Predict Tomorrow</button>
       
        <button onClick={onNextWeekPredictBtnPress} className={styles.predictBtn}>Predict Week</button>
       
        <button onClick={onResetData} className={styles.resetBtn}>Reset</button>
      </div>
        {
          (isSinglePredicted && !isReset) && <h5 className={styles.predictedText}>Predicted price is ${nextDayPrediction?.next_day_price}</h5>
        }
        {
          isMultiplePredicted && <h5 className={styles.predictedText}>Predicted prices are $ {nextWeekPrediction?.next_7_days.map(item => `$${item}`).join(' ')}</h5>
        }
      </div>
      </main>
      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
