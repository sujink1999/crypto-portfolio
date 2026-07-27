"use client";
/* eslint-disable @next/next/no-img-element */

import { ReactElement, useEffect, useRef, useState } from "react";
import { CircularSuccessIcon, CloseIcon, ErrorIcon, RedirectIcon } from "./icons";
import { TransactionLoader } from "./shared";
import ExpandableBox from "./ExpandableBox";

// ---- ToastStatus enum (numeric, verbatim order from src/utils/types.ts) ----
enum ToastStatus {
  CONFIRM_APPROVAL,
  APPROVING,
  APPROVED,
  CONFIRM_SUBMIT_TX,
  TX_SUBMITTED,
  TX_SUCCESS,
  VIEW_TX_HASH,
  APPROVE_ERROR,
  TX_ERROR,
}

enum StepType {
  IDLE,
  IN_PROGRESS,
  DONE,
  ERROR,
}

// ---- flowConfig (verbatim from TransactionToast.tsx) ----
const flowConfig: Record<
  number,
  {
    progressColor: string;
    firstStepType: StepType;
    secondStepType: StepType;
    showTxDetails: boolean;
    showTxHash: boolean;
  }
> = {
  [ToastStatus.CONFIRM_APPROVAL]: {
    progressColor: "#4D5966",
    firstStepType: StepType.IN_PROGRESS,
    secondStepType: StepType.IDLE,
    showTxDetails: false,
    showTxHash: false,
  },
  [ToastStatus.APPROVING]: {
    progressColor: "#967CC9",
    firstStepType: StepType.IN_PROGRESS,
    secondStepType: StepType.IDLE,
    showTxDetails: false,
    showTxHash: false,
  },
  [ToastStatus.APPROVED]: {
    progressColor: "#967CC9",
    firstStepType: StepType.DONE,
    secondStepType: StepType.IDLE,
    showTxDetails: false,
    showTxHash: false,
  },
  [ToastStatus.CONFIRM_SUBMIT_TX]: {
    progressColor: "#967CC9",
    firstStepType: StepType.DONE,
    secondStepType: StepType.IN_PROGRESS,
    showTxDetails: true,
    showTxHash: false,
  },
  [ToastStatus.TX_SUBMITTED]: {
    progressColor: "#488FFF",
    firstStepType: StepType.DONE,
    secondStepType: StepType.IN_PROGRESS,
    showTxDetails: true,
    showTxHash: true,
  },
  [ToastStatus.TX_SUCCESS]: {
    progressColor: "#22C55E",
    firstStepType: StepType.DONE,
    secondStepType: StepType.DONE,
    showTxDetails: true,
    showTxHash: true,
  },
  [ToastStatus.VIEW_TX_HASH]: {
    progressColor: "#22C55E",
    firstStepType: StepType.DONE,
    secondStepType: StepType.DONE,
    showTxDetails: false,
    showTxHash: true,
  },
  [ToastStatus.APPROVE_ERROR]: {
    progressColor: "#EF4444",
    firstStepType: StepType.ERROR,
    secondStepType: StepType.IDLE,
    showTxDetails: false,
    showTxHash: false,
  },
  [ToastStatus.TX_ERROR]: {
    progressColor: "#EF4444",
    firstStepType: StepType.DONE,
    secondStepType: StepType.ERROR,
    showTxDetails: false,
    showTxHash: false,
  },
};

// ---- Scripted demo payloads / sequences ----
type ToastPayload = {
  includesApproval: boolean;
  transactionType: "supply" | "withdraw" | "borrow" | "repay";
  amount: string;
  symbol: string;
  logo: string;
  supplyApy: string;
  borrowApy: string;
  ltv: string;
  pctSupplyBorrowed: string;
  txHash: string;
};

type Scenario = {
  payload: ToastPayload;
  steps: { status: ToastStatus; ms: number }[]; // ms = delay before this step
};

const T = 2000; // per-step dwell (~2s)

const SCENARIOS: Scenario[] = [
  // Supply-with-approval, full success path.
  {
    payload: {
      includesApproval: true,
      transactionType: "supply",
      amount: "1.5",
      symbol: "ETH",
      logo: "/showcase/ovix/ETH-logo.svg",
      supplyApy: "2.14",
      borrowApy: "3.89",
      ltv: "82.50",
      pctSupplyBorrowed: "34.10",
      txHash: "0x9f3c…a21b",
    },
    steps: [
      { status: ToastStatus.CONFIRM_APPROVAL, ms: 0 },
      { status: ToastStatus.APPROVING, ms: T },
      { status: ToastStatus.APPROVED, ms: T },
      { status: ToastStatus.CONFIRM_SUBMIT_TX, ms: T },
      { status: ToastStatus.TX_SUBMITTED, ms: T },
      { status: ToastStatus.TX_SUCCESS, ms: T },
      { status: ToastStatus.VIEW_TX_HASH, ms: T },
    ],
  },
  // Borrow, no approval.
  {
    payload: {
      includesApproval: false,
      transactionType: "borrow",
      amount: "2,500",
      symbol: "USDC",
      logo: "/showcase/ovix/USDC-logo.svg",
      supplyApy: "4.62",
      borrowApy: "6.71",
      ltv: "85.00",
      pctSupplyBorrowed: "65.20",
      txHash: "0x41ab…7c0d",
    },
    steps: [
      { status: ToastStatus.CONFIRM_SUBMIT_TX, ms: 0 },
      { status: ToastStatus.TX_SUBMITTED, ms: T },
      { status: ToastStatus.TX_SUCCESS, ms: T },
      { status: ToastStatus.VIEW_TX_HASH, ms: T },
    ],
  },
  // Occasional error branch.
  {
    payload: {
      includesApproval: false,
      transactionType: "borrow",
      amount: "500",
      symbol: "DAI",
      logo: "/showcase/ovix/DAI-logo.svg",
      supplyApy: "4.05",
      borrowApy: "6.12",
      ltv: "80.00",
      pctSupplyBorrowed: "48.70",
      txHash: "0x00d3…9e11",
    },
    steps: [
      { status: ToastStatus.CONFIRM_SUBMIT_TX, ms: 0 },
      { status: ToastStatus.TX_SUBMITTED, ms: T },
      { status: ToastStatus.TX_ERROR, ms: T },
    ],
  },
];

const isTerminal = (s: ToastStatus) =>
  s === ToastStatus.APPROVE_ERROR ||
  s === ToastStatus.TX_ERROR ||
  s === ToastStatus.VIEW_TX_HASH;

const TransactionToast = () => {
  const [refresh, setRefresh] = useState(0);
  const [openToast, setOpenToast] = useState(false);
  const [toastTxStatus, setToastTxStatus] = useState<ToastStatus>(
    ToastStatus.CONFIRM_APPROVAL,
  );
  const [payload, setPayload] = useState<ToastPayload>(SCENARIOS[0].payload);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const shouldClose = isTerminal(toastTxStatus);

  const close = () => {
    if (!openToast && timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setOpenToast(false);
  };

  // Re-measure the ExpandableBox panels whenever the stage or open state
  // changes - the load-bearing mechanic.
  useEffect(() => {
    // Port of the source's refresh bump: forces the ExpandableBox panels to
    // re-measure whenever the stage or open state changes. This deliberate
    // re-render is the whole point of the mechanic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRefresh((r) => r + 1);
  }, [toastTxStatus, openToast]);

  // Auto-dismiss on terminal stages after 5000ms (matches the 5s progress fill).
  useEffect(() => {
    if (isTerminal(toastTxStatus)) {
      timer.current = setTimeout(() => setOpenToast(false), 5000);
    }
  }, [toastTxStatus]);

  useEffect(() => {
    if (!openToast && timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, [openToast]);

  // Scripted engine: loops through the scenarios forever.
  useEffect(() => {
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.current.push(id);
    };

    const runScenario = (index: number) => {
      const scenario = SCENARIOS[index % SCENARIOS.length];
      setPayload(scenario.payload);
      setOpenToast(true);

      let elapsed = 0;
      scenario.steps.forEach((step) => {
        elapsed += step.ms;
        schedule(() => setToastTxStatus(step.status), elapsed);
      });

      // After the terminal stage: 5s auto-dismiss visual + a short pause,
      // then start the next scenario.
      const nextIn = elapsed + 5000 + 1400;
      schedule(() => runScenario(index + 1), nextIn);
    };

    runScenario(0);

    return () => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
    };
  }, []);

  const { progressColor, firstStepType, secondStepType, showTxDetails, showTxHash } =
    flowConfig[toastTxStatus] || {};

  const isBorrowOrRepay =
    payload.transactionType === "borrow" || payload.transactionType === "repay";
  const apyValue = isBorrowOrRepay ? payload.borrowApy : payload.supplyApy;
  const apyLabel = isBorrowOrRepay ? "Borrow" : "Supply";

  return (
    <div
      className={` transition-all shadow-md select-none bg-darkCard right-4 bottom-4 fixed rounded-md w-[306px] overflow-hidden ${
        openToast ? "show-toast" : "hide-toast"
      }`}
    >
      <div className="flex bg-[#4D5966]">
        <div
          className={` h-[5px] ${shouldClose ? " load-progress" : " w-full"} `}
          style={{ backgroundColor: progressColor }}
        />
      </div>

      <ExpandableBox
        refresh={refresh}
        show={toastTxStatus !== ToastStatus.VIEW_TX_HASH}
      >
        <div className="p-3 flex flex-col">
          {payload.includesApproval && (
            <>
              <TransactionStep
                type={firstStepType}
                title="Approve"
                successTitle="Approved!"
                errorTitle="Approval failed."
                text="This approve only need to be completed once for each token."
                stepNumber={1}
                loaderColor={"#6A4AF2"}
              />
              <div className="flex flex-col gap-1 w-9 items-center">
                <div className="h-[6px] w-[2px] bg-[#B5B5B533] rounded-sm" />
                <div className="h-1 w-[2px] bg-[#B5B5B533] rounded-sm" />
                <div className="h-[6px] w-[2px] bg-[#B5B5B533] rounded-sm" />
              </div>
            </>
          )}
          <TransactionStep
            type={secondStepType}
            successTitle="Created Transaction"
            title="Creating Transaction"
            text="Please confirm the transaction in your wallet."
            errorTitle="Transation failed."
            stepNumber={2}
            loaderColor={
              toastTxStatus === ToastStatus.TX_SUBMITTED ? "#488FFF" : "#967CC9"
            }
          />
        </div>
      </ExpandableBox>

      <ExpandableBox refresh={refresh} show={!!showTxDetails}>
        <div className="flex flex-col">
          <div className="flex h-[1px] bg-dropdown mt-1" />
          <div className="flex flex-col gap-1 p-3">
            <ToastLineItem
              trailingText={`${payload.amount} ${payload.symbol}`}
              label="Amount"
            />
            <ToastLineItem
              logo={payload.logo}
              trailingText={`${apyValue}%`}
              label={`${apyLabel} APY`}
            />
            <ToastLineItem trailingText={`${payload.ltv}%`} label="Loan-To-Value" />
            <ToastLineItem
              trailingText={`${payload.pctSupplyBorrowed}%`}
              label="% of Supply Borrowed"
            />
          </div>
        </div>
      </ExpandableBox>

      <ExpandableBox refresh={refresh} show={!!showTxHash}>
        <div className="pr-3 h-10 flex bg-chip items-center pl-3 text-sm font-light justify-between">
          <div className="text-[#F2F4FE] underline transition-all flex items-baseline gap-2 hover:text-purple cursor-pointer">
            <p>View on Polygonscan</p>
            <RedirectIcon className="w-[9px] h-[9px]" />
          </div>
          <div className="hover:scale-105 cursor-pointer transform">
            <CloseIcon onClick={close} className="w-3 h-3 transition-all" />
          </div>
        </div>
      </ExpandableBox>
    </div>
  );
};

const TransactionStep = ({
  type,
  title,
  text,
  stepNumber,
  successTitle,
  loaderColor,
  errorTitle,
}: {
  type: StepType;
  title: string;
  text: string;
  stepNumber: number;
  successTitle: string;
  loaderColor: string;
  errorTitle: string;
}) => {
  const iconBg = type === StepType.IDLE ? "bg-black/20" : "bg-black/40";
  const titleColor = type === StepType.IDLE ? "text-white/30 " : "text-white ";
  const textColor = type === StepType.IDLE ? "text-tertiary/40 " : "text-tertiary ";

  const getIcon = () => {
    if (type === StepType.IN_PROGRESS) {
      return <TransactionLoader color={loaderColor} />;
    } else if (type === StepType.IDLE) {
      return <p className="font-light text-white/30">{stepNumber}</p>;
    } else if (type === StepType.ERROR) {
      return <ErrorIcon className="w-5 h-5" />;
    }
    return <CircularSuccessIcon className="w-5 h-5" />;
  };

  const getTitle = () => {
    if (type === StepType.DONE) return successTitle;
    if (type === StepType.ERROR) return errorTitle;
    return title;
  };

  const showSubtitle = !(type === StepType.DONE || type === StepType.ERROR);

  return (
    <div className="flex items-center gap-3">
      <div
        className={` w-9 h-9 rounded-full ${iconBg} items-center justify-center flex my-2`}
      >
        {getIcon()}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <p className={`${titleColor} font-semibold`}>{getTitle()}</p>
        {showSubtitle && (
          <p className={`${textColor} text-sm leading-4`}>{text}</p>
        )}
      </div>
    </div>
  );
};

// ToastLineItem (ported from ToastLineItem.tsx).
const ToastLineItem = ({
  trailing,
  trailingText,
  label,
  logo,
}: {
  label: string;
  logo?: string;
  trailingText?: string;
  trailing?: ReactElement;
}) => (
  <div className="flex justify-between">
    <div className="flex items-center gap-2">
      {logo && <img src={logo} width={16} height={16} className="h-4 w-4" alt="" />}
      <p className="text-tertiary">{label}</p>
    </div>
    {trailingText ? (
      <p className="text-white font-medium">{trailingText}</p>
    ) : (
      trailing
    )}
  </div>
);

export default TransactionToast;
