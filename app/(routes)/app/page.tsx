import React from 'react'
import AiToolList from './_components/AiToolList'
import { Users } from 'lucide-react'
import UsersAdsList from './_components/UsersAdsList'

function AppHomePage() {
    return (
        <div>
            <AiToolList />
            <UsersAdsList />
        </div>
    )
}

export default AppHomePage