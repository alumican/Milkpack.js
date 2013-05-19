jpp.util.Namespace('jpp.command').use()

class CommandUtil

    @serial: (execute, commands...) ->
        c = new jpp.command.Serial(commands...)
        c.execute() if execute
        return c

    @parallel: (execute, commands...) ->
        c = new jpp.command.Parallel(commands...)
        c.execute() if execute
        return c

# export class
window.CommandUtil = CommandUtil
