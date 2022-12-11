#!/usr/bin/env node
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import handleCliError from 'handle-cli-error'
import { readPackageUp } from 'read-pkg-up'
import UpdateNotifier from 'update-notifier'

import * as instructions from '../main.js'

import { parseInput } from './input.js'

// Run a server instruction, from the CLI
const startCli = async function () {
  try {
    await checkUpdate()

    const measures = []
    const { instruction, opts } = parseInput({ measures })

    await instructions[instruction]({ ...opts, measures })
  } catch (error) {
    setErrorDescription(error)
    handleCliError(error, { stack: false })
  }
}

// TODO: use static JSON imports once those are possible
const checkUpdate = async function () {
  const cwd = dirname(fileURLToPath(import.meta.url))
  const { packageJson } = await readPackageUp({ cwd, normalize: false })
  UpdateNotifier({ pkg: packageJson }).notify()
}

const setErrorDescription = function (error) {
  if (error instanceof Error && error.description !== undefined) {
    error.message = error.description
  }
}

await startCli()
