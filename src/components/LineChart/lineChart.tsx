'use client'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend
);

type LineChartData = ChartData<'line', number[], string>;
type LineChartOptions = ChartOptions<'line'>;

interface ILineChart {
    data: LineChartData,
    options: LineChartOptions
}

export default function LineChart({data, options}: Readonly<ILineChart>) {
    return <Line data={data} options={options} width={500} height={300}/>
}