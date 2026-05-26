"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught a render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex justify-center items-center bg-background">
          <div className="bg-red-500 text-white p-8 rounded-md shadow-md text-center">
            <h2 className="text-4xl font-bold mb-6">Something went wrong!</h2>
            <p className="text-lg mb-6">An unexpected error occurred.</p>
            <button
              className="bg-white text-red-500 px-6 py-3 rounded-md hover:bg-red-100 focus:outline-none"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
