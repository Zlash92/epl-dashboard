import styled from "@emotion/styled";
import {Radar} from "react-chartjs-2";
import {round} from "mathjs";
import {COLOR_RADAR_CHART, COLOR_TEXT_WHITE, generateRandomColor} from "./Colors";
import 'chartjs-plugin-datalabels';

const ContainerDiv = styled.div`
  min-height: 50vh;
  min-width: 50vw;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  border: 2px solid;
`

const normalizeChartValue = value => Math.log(value)
const inverseNormalizedValue = value => round(Math.exp(value), 2)

const chartOptions = {
    scale: {
        pointLabels: {
            fontColor: COLOR_TEXT_WHITE,
            fontSize: 14
        },
        ticks: {
            showLabelBackdrop: false,
            fontColor: COLOR_TEXT_WHITE,
            display: false,
            maxTicksLimit: 3,

        },
        angleLines: {
            color: COLOR_RADAR_CHART,
        },
        gridLines: {
            color: COLOR_RADAR_CHART,
        }
    },
    legend: {
        labels: {
            fontColor: COLOR_TEXT_WHITE
        }
    },
    tooltips: {
        mode: 'index',
        titleFontSize: 15,
        bodyFontSize: 15,
        callbacks: {
            title: (tooltipItem, chartData) => {
                const statIndex = tooltipItem[0].index;
                const statName = chartData.labels[statIndex]
                return statName
            },
            label: (tooltipItem, chartData) => {
                console.log(tooltipItem, chartData)
                const playerIndex = tooltipItem.datasetIndex
                const playerLabel = chartData.datasets[playerIndex].label
                const stat = tooltipItem.value
                return `${playerLabel}: ${inverseNormalizedValue(stat)}`
            },
        }
    },
    plugins: {  // chartjs-plugin-datalabels
        datalabels: {
            display: true,
            color: 'white',
            anchor: 'end',
            align: 'left',
            offset: 5,
            formatter: (value, context) => {
                return inverseNormalizedValue(value)
            }
        },
    },
}

const PlayerDetails = ({data}) => {
    // TODO: Support multiple players
    console.log("data received", data)

    const data2 = data.map(playerData => {
        const {
            player_name,
            time,
            goals90,
            xG90,
            shots90,
            assists90,
            xA90,
            key_passes90,
            xGChain90,
            xGBuildup90
        } = playerData

        return {
            player_name,
            time,
            goals90,
            xG90,
            shots90,
            assists90,
            xA90,
            key_passes90,
            xGChain90,
            xGBuildup90
        }
    })

    // const {
    //     player_name,
    //     time,
    //     goals90,
    //     xG90,
    //     shots90,
    //     assists90,
    //     xA90,
    //     key_passes90,
    //     xGChain90,
    //     xGBuildup90
    // } = data[1] || {}

    // const playerData = [goals90, xG90, shots90, assists90, xA90, key_passes90, xGChain90, xGBuildup90]

    const radarData = {
        labels: ["Goals90", "xG90", "Shots90", "Assists90", "xA90", "KeyPasses90", "xGChain90", "xGBuildup90"],
        datasets: data2.map(playerData => {
            const { player_name, time, goals90, xG90, shots90, assists90, xA90, key_passes90, xGChain90, xGBuildup90 } = playerData
            const playerColor = generateRandomColor()
            return {
                label: `${player_name} (${time} min)`,
                data: [goals90, xG90, shots90, assists90, xA90, key_passes90, xGChain90, xGBuildup90].map(stat => {
                    if (stat !== undefined) return normalizeChartValue(stat)
                }),
                borderColor: playerColor,
                hoverBackgroundColor: "#0F0",
                pointBackgroundColor: playerColor,
            }
        }),
    }

    return (
        <ContainerDiv>
            {data && <h1>{data["player_name"]}</h1>}
            <Radar data={radarData} options={chartOptions}/>
        </ContainerDiv>
    )
}

export default PlayerDetails;