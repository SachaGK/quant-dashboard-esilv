#!/usr/bin/env python3
"""
Simple Daily Report Generator
Run this script daily to get a market summary
"""

import yfinance as yf
from datetime import datetime
import os

# Default tickers to track
TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA']

def generate_report():
    print("=" * 60)
    print(f"Daily Market Report - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)

    for ticker in TICKERS:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period='1d')

            if not hist.empty:
                close = hist['Close'].iloc[-1]
                open_price = hist['Open'].iloc[0]
                change = ((close - open_price) / open_price) * 100

                print(f"\n{ticker}:")
                print(f"  Open: ${open_price:.2f}")
                print(f"  Close: ${close:.2f}")
                print(f"  Change: {change:+.2f}%")
        except Exception as e:
            print(f"\n{ticker}: Error - {e}")

    print("\n" + "=" * 60)

if __name__ == '__main__':
    generate_report()
